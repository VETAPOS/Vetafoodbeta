export function getBackendUrl(){
  return (import.meta.env.VITE_BACKEND_URL) || localStorage.getItem('backend_url') || 'http://127.0.0.1:3000'
}

export async function fetchWithHeaders(path, {companyId, userId, method='GET', body=null}={}){
  const url = getBackendUrl().replace(/\/$/, '') + path
  const headers = {
    'Content-Type': 'application/json'
  }
  if(companyId) headers['X-Company-Id'] = companyId
  if(userId) headers['X-User-Id'] = userId

  const res = await fetch(url, {method, headers, body: body? JSON.stringify(body): undefined})
  return res
}
