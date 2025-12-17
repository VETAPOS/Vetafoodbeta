const express = require('express');
const router = express.Router();
const { getSettings, upsertSettings } = require('../services/settings_service');
const { hasPermission } = require('../services/rbac');

// GET /api/v1/settings?company_id=...
router.get('/', async (req, res) => {
  try {
    const companyId = req.query.company_id;
    if (!companyId) return res.status(400).json({ error: 'company_id is required' });

    const userHeader = req.get('X-User-Id');
    const companyHeader = req.get('X-Company-Id');
    if (!userHeader || !companyHeader) return res.status(401).json({ error: 'Missing X-User-Id or X-Company-Id headers' });

    const allowed = await hasPermission({ userId: userHeader, companyId: companyHeader, permissionCode: 'settings:read' });
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });

    const s = await getSettings(companyId);
    if (!s) return res.status(404).json({ error: 'Settings not found' });
    return res.json(s);
  } catch (err) {
    console.error('GET /api/v1/settings error', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// PATCH /api/v1/settings
router.patch('/', async (req, res) => {
  try {
    const body = req.body || {};
    const companyId = body.company_id;
    if (!companyId) return res.status(400).json({ error: 'company_id is required in body' });

    const userHeader = req.get('X-User-Id');
    const companyHeader = req.get('X-Company-Id');
    if (!userHeader || !companyHeader) return res.status(401).json({ error: 'Missing X-User-Id or X-Company-Id headers' });

    const allowed = await hasPermission({ userId: userHeader, companyId: companyHeader, permissionCode: 'settings:update' });
    if (!allowed) return res.status(403).json({ error: 'Forbidden' });

    const payload = {
      timezone: body.timezone,
      currency: body.currency,
      allow_offline: body.allow_offline,
      offline_days_limit: body.offline_days_limit
    };

    const updated = await upsertSettings(companyId, payload);
    return res.json(updated);
  } catch (err) {
    console.error('PATCH /api/v1/settings error', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
