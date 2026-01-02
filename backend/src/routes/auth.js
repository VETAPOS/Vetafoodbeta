const express = require('express');
const router = express.Router();
const { step1CreateCompanyAndOwner, step2CompleteProfile } = require('../services/auth_service');

// POST /api/auth/register/step1
router.post('/register/step1', async (req, res) => {
  try{
    const { business_name, email, phone_country_code, phone_number, password } = req.body || {};
    // basic validations
    if(!business_name) return res.status(400).json({ error: 'business_name is required' });
    if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: 'valid email is required' });
    if(!phone_country_code) return res.status(400).json({ error: 'phone_country_code is required' });
    if(!phone_number || !/^\d+$/.test(phone_number)) return res.status(400).json({ error: 'phone_number is required and must be digits' });
    if(!password || password.length < 8) return res.status(400).json({ error: 'password min length 8' });

    try{
      const out = await step1CreateCompanyAndOwner({ business_name, email, phone_country_code, phone_number, password });
      return res.status(201).json(out);
    }catch(err){
      if(err.code === 'EMAIL_EXISTS') return res.status(409).json({ error: 'email already exists' });
      throw err;
    }
  }catch(err){
    console.error('POST /register/step1 error', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/auth/register/step2
router.post('/register/step2', async (req, res) => {
  try{
    const auth = req.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : req.body.registration_token || null;
    const { company_id, contact_name, business_type } = req.body || {};
    if(!token) return res.status(401).json({ error: 'registration token required' });
    if(!company_id) return res.status(400).json({ error: 'company_id is required' });
    if(!contact_name) return res.status(400).json({ error: 'contact_name is required' });
    if(!business_type) return res.status(400).json({ error: 'business_type is required' });

    try{
      const company = await step2CompleteProfile({ token, company_id, contact_name, business_type });
      return res.json({ success: true, company });
    }catch(err){
      if(err.code === 'INVALID_TOKEN' || err.code === 'TOKEN_EXPIRED' || err.code === 'TOKEN_USED') return res.status(401).json({ error: err.message });
      throw err;
    }

  }catch(err){
    console.error('POST /register/step2 error', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
