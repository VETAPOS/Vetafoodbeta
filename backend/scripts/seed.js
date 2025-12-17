// Minimal seed script: creates a Company and default Settings using Prisma.
// Run from backend/ with: node scripts/seed.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

async function main(){
  const prisma = new PrismaClient();
  try{
    const companyId = crypto.randomUUID();
    console.log('Seeding company_id =', companyId);

    const company = await prisma.company.create({
      data: {
        company_id: companyId,
        name: 'Veta Seed Company'
      }
    });

    const settings = await prisma.settings.create({
      data: {
        settings_id: crypto.randomUUID(),
        company_id: company.company_id,
        timezone: 'America/Mexico_City',
        currency: 'MXN',
        allow_offline: true,
        offline_days_limit: 3
      }
    });

    console.log('Created company and settings');
    console.log({ company, settings });
  }catch(err){
    console.error('Seed error:', err.message || err);
    process.exitCode = 1;
  }finally{
    try{ await require('@prisma/client').PrismaClient.prototype.$disconnect(); }catch(e){}
  }
}

main();
