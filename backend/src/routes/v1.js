const express = require('express');
const router = express.Router();

// Health
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Bootstrap (placeholder)
router.post('/bootstrap', (req, res) => {
  // Expected to create company + admin + roles + permissions + settings
  // For now return a placeholder
  return res.status(201).json({ company_id: null, user_id: null, message: 'bootstrap placeholder' });
});

// Settings (GET / PATCH placeholders)
// Delegate settings endpoints to a dedicated router
router.use('/settings', require('./settings'));

module.exports = router;
