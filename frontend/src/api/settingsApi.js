import { fetchWithHeaders } from './client'

export async function getSettings({companyId, userId}){
  const res = await fetchWithHeaders(`/api/v1/settings?company_id=${companyId}`, {companyId, userId})
  if(!res.ok){
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}

export async function updateSettings({companyId, userId, payload}){
  const res = await fetchWithHeaders('/api/v1/settings', {companyId, userId, method:'PATCH', body:payload})
  if(!res.ok){
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return res.json()
}
