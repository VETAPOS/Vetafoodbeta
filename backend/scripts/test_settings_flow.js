// Simple test script that performs GET -> PATCH -> GET against /api/v1/settings
// Usage: node scripts/test_settings_flow.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fetch = global.fetch || require('node-fetch');

const BACKEND = process.env.BACKEND_URL || 'http://127.0.0.1:3000';
const COMPANY_ID = process.env.TEST_COMPANY_ID || '3cc6399e-2eeb-45ae-b98b-fab6c8635721';

async function run(){
  try{
    console.log('Using backend:', BACKEND);
    const headers = { 'X-Company-Id': COMPANY_ID, 'X-User-Id': 'test-runner', 'Content-Type': 'application/json' };

    console.log('\n1) GET settings');
    let res = await fetch(`${BACKEND}/api/v1/settings?company_id=${COMPANY_ID}`, { headers });
    console.log('Status', res.status);
    let data = await res.text();
    try{ data = JSON.parse(data); }catch(e){}
    console.log('Body:', data);

    console.log('\n2) PATCH settings (toggle currency -> EUR, timezone -> Europe/Madrid)');
    const patchBody = { company_id: COMPANY_ID, currency: 'EUR', timezone: 'Europe/Madrid' };
    res = await fetch(`${BACKEND}/api/v1/settings`, { method: 'PATCH', headers, body: JSON.stringify(patchBody) });
    console.log('Status', res.status);
    data = await res.text();
    try{ data = JSON.parse(data); }catch(e){}
    console.log('Body:', data);

    console.log('\n3) GET settings (after update)');
    res = await fetch(`${BACKEND}/api/v1/settings?company_id=${COMPANY_ID}`, { headers });
    console.log('Status', res.status);
    data = await res.text();
    try{ data = JSON.parse(data); }catch(e){}
    console.log('Body:', data);

  }catch(err){
    console.error('Test flow error:', err.message || err);
    process.exitCode = 1;
  }
}

run();
