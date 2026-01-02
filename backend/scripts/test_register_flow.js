// Test script to exercise registration step1 and step2
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fetch = global.fetch || require('node-fetch');
const crypto = require('crypto');

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:3000';

async function main(){
  const step1Body = {
    business_name: 'Prisma Test Co',
    email: `test+${crypto.randomBytes(4).toString('hex')}@example.com`,
    phone_country_code: '+52',
    phone_number: '3312345678',
    password: 'supersecret'
  };

  console.log('STEP1 body', step1Body);
  let res = await fetch(`${BACKEND}/api/auth/register/step1`, { method: 'POST', body: JSON.stringify(step1Body), headers: { 'Content-Type': 'application/json' }});
  console.log('STEP1 status', res.status);
  const data = await res.json();
  console.log('STEP1 resp', data);
  if(res.status !== 201) return;

  const { company_id, registration_token } = data;

  const step2Body = { company_id, contact_name: 'Isaac Velazco', business_type: 'RESTAURANTE_QSR' };
  res = await fetch(`${BACKEND}/api/auth/register/step2`, { method: 'POST', body: JSON.stringify(step2Body), headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + registration_token }});
  console.log('STEP2 status', res.status);
  console.log('STEP2 resp', await res.json());
}

main().catch(err=>{ console.error(err); process.exitCode=1; });
