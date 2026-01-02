import { getBackendUrl } from './client'

export async function registerStep1(payload){
  const url = getBackendUrl() + '/api/auth/register/step1'
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  return res
}

export async function registerStep2(payload, token){
  const url = getBackendUrl() + '/api/auth/register/step2'
  const headers = { 'Content-Type': 'application/json' }
  if(token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) })
  return res
}
