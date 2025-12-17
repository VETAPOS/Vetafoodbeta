// backend/src/services/rbac.js
// RBAC service placeholder. In production this will query the DB (roles -> permissions).

async function hasPermission({ userId, companyId, permissionCode }){
  // For now, require headers to be present; real check must query DB.
  if (!userId || !companyId) return false;
  // TODO: replace with real DB check
  return true;
}

module.exports = { hasPermission };
