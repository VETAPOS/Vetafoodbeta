const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { prisma, isPrismaReady } = require('../db/prisma');

const REGISTRATION_TOKEN_TTL_MIN = 60; // minutes

function hashToken(token){
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function step1CreateCompanyAndOwner({ business_name, email, phone_country_code, phone_number, password }){
  if(!isPrismaReady) throw new Error('Prisma not available');

  // We will store the provided contact email on Company (contact_email) but
  // generate a dedicated admin email for the user: admin@<normalized-business-name>
  // Normalization: remove accents, lowercase, replace non-alphanum with dash, trim dashes.
  function normalizeName(name){
    if(!name) return '';
    // remove accents
    const s = name.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    // to lower, replace non-alnum with dash, collapse dashes
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');
  }

  const base = normalizeName(business_name) || 'company';
  const adminPrefix = `admin@${base}`;

  return await prisma.$transaction(async (tx) => {
    // create company record, keep contact email separately
    const company = await tx.company.create({ data: {
      business_name,
      contact_email: email,
      phone_country_code,
      phone_number
    }});

    // find existing admin emails that start with admin@<base>
    const existingAdmins = await tx.user.findMany({ where: { email: { startsWith: adminPrefix } }, select: { email: true } });

    // Determine unique admin email: if none exists, use admin@base, otherwise append a numeric suffix
    let adminEmail = adminPrefix;
    if(existingAdmins.length > 0){
      // collect suffixes
      const nums = existingAdmins.map(u => {
        const part = u.email.slice(adminPrefix.length);
        if(!part) return 0; // exact match
        const m = part.match(/^([0-9]+)$/);
        return m ? parseInt(m[1],10) : 0;
      });
      const max = Math.max(0, ...nums);
      adminEmail = adminPrefix + String(max + 1);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await tx.user.create({ data: {
      company_id: company.company_id,
      email: adminEmail,
      password_hash,
      role: 'OWNER'
    }});

    // create registration session
    const token = crypto.randomBytes(32).toString('hex');
    const token_hash = hashToken(token);
    const expires_at = new Date(Date.now() + REGISTRATION_TOKEN_TTL_MIN * 60 * 1000);

    await tx.registrationSession.create({ data: {
      company_id: company.company_id,
      token_hash,
      expires_at
    }});

    return { company_id: company.company_id, registration_token: token, admin_email: adminEmail };
  });
}

async function validateRegistrationToken(token){
  if(!isPrismaReady) throw new Error('Prisma not available');
  const token_hash = hashToken(token);
  const session = await prisma.registrationSession.findUnique({ where: { token_hash } });
  if(!session) return null;
  if(session.used_at) return null;
  if(new Date(session.expires_at) < new Date()) return null;
  return session;
}

async function step2CompleteProfile({ token, company_id, contact_name, business_type }){
  if(!isPrismaReady) throw new Error('Prisma not available');

  const token_hash = hashToken(token);
  const session = await prisma.registrationSession.findUnique({ where: { token_hash } });
  if(!session) {
    const err = new Error('Invalid token'); err.code = 'INVALID_TOKEN'; throw err;
  }
  if(session.company_id !== company_id){ const err = new Error('Token does not match company'); err.code = 'INVALID_TOKEN'; throw err; }
  if(session.used_at) { const err = new Error('Token already used'); err.code='TOKEN_USED'; throw err; }
  if(new Date(session.expires_at) < new Date()){ const err = new Error('Token expired'); err.code='TOKEN_EXPIRED'; throw err; }

  const company = await prisma.company.update({ where: { company_id }, data: {
    contact_name,
    business_type,
    onboarding_status: 'COMPLETED'
  }});

  await prisma.registrationSession.update({ where: { id: session.id }, data: { used_at: new Date() } });

  return company;
}

module.exports = { step1CreateCompanyAndOwner, validateRegistrationToken, step2CompleteProfile };
