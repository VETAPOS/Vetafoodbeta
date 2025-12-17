// Settings service: uses Prisma when available, otherwise falls back to in-memory store.
const { prisma, isPrismaReady } = require('../db/prisma');
const crypto = require('crypto');

const store = new Map(); // in-memory fallback: company_id -> settings object

async function getSettings(companyId){
  if(!companyId) throw new Error('company_id required');

  if(isPrismaReady){
    // Prisma model name is Settings
    const s = await prisma.settings.findUnique({ where: { company_id: companyId } });
    if(!s) return null;
    return s;
  }

  const s = store.get(companyId);
  if(!s) return null;
  return { ...s };
}

async function upsertSettings(companyId, payload){
  if(!companyId) throw new Error('company_id required');

  if(isPrismaReady){
    // Use upsert: create if missing, update otherwise
    const data = {
      timezone: payload.timezone ?? undefined,
      currency: payload.currency ?? undefined,
      allow_offline: typeof payload.allow_offline === 'boolean' ? payload.allow_offline : undefined,
      offline_days_limit: typeof payload.offline_days_limit === 'number' ? payload.offline_days_limit : undefined
    };

    // Remove undefined fields so Prisma won't attempt to set them to null
    Object.keys(data).forEach(k => data[k] === undefined && delete data[k]);

    const upserted = await prisma.settings.upsert({
      where: { company_id: companyId },
      update: data,
      create: {
        settings_id: crypto.randomUUID(),
        company_id: companyId,
        timezone: data.timezone ?? 'America/Mexico_City',
        currency: data.currency ?? 'MXN',
        allow_offline: data.allow_offline ?? true,
        offline_days_limit: data.offline_days_limit ?? 3
      }
    });

    return upserted;
  }

  // Fallback in-memory implementation
  const current = store.get(companyId) || {
    settings_id: null,
    company_id: companyId,
    timezone: 'America/Mexico_City',
    currency: 'MXN',
    allow_offline: true,
    offline_days_limit: 3
  };

  const updated = {
    ...current,
    timezone: payload.timezone ?? current.timezone,
    currency: payload.currency ?? current.currency,
    allow_offline: typeof payload.allow_offline === 'boolean' ? payload.allow_offline : current.allow_offline,
    offline_days_limit: typeof payload.offline_days_limit === 'number' ? payload.offline_days_limit : current.offline_days_limit
  };

  // Set a fake settings_id if missing
  if(!updated.settings_id) updated.settings_id = crypto.randomUUID();

  store.set(companyId, updated);
  return { ...updated };
}

module.exports = { getSettings, upsertSettings };
