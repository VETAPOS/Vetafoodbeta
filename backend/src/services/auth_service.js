const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { prisma, isPrismaReady } = require('../db/prisma');

const REGISTRATION_TOKEN_TTL_MIN = 60; // minutes

function hashToken(token){
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function step1CreateCompanyAndOwner({ business_name, email, phone_country_code, phone_number, password }){
  if(!isPrismaReady) throw new Error('Prisma not available');

  // validate uniqueness of email
  const existing = await prisma.user.findUnique({ where: { email } }).catch(()=>null);
  if(existing) {
    const err = new Error('Email already exists');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  return await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({ data: {
      business_name,
      phone_country_code,
      phone_number
    }});

    const password_hash = await bcrypt.hash(password, 10);
    const user = await tx.user.create({ data: {
      company_id: company.company_id,
      email,
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

    return { company_id: company.company_id, registration_token: token };
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
