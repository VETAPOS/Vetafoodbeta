import React, { useState, useEffect } from 'react'

function looksLikeUUID(v){
  if(!v) return false
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
}

export default function IdHeaderForm({onSave}){
  const [backendUrl, setBackendUrl] = useState(localStorage.getItem('backend_url') || import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000')
  const [companyId, setCompanyId] = useState(localStorage.getItem('company_id') || '')
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || '')
  const [error, setError] = useState(null)

  useEffect(()=>{ setError(null) }, [backendUrl, companyId, userId])

  function save(){
    if(!looksLikeUUID(companyId)) return setError('company_id inválido')
    if(!looksLikeUUID(userId)) return setError('user_id inválido')
    localStorage.setItem('backend_url', backendUrl)
    localStorage.setItem('company_id', companyId)
    localStorage.setItem('user_id', userId)
    setError(null)
    if(onSave) onSave({backendUrl, companyId, userId})
  }

  return (
    <div className="card">
      <h2>Configuración de conexión</h2>
      <div className="form-group">
        <label>BACKEND URL</label>
        <input className="input" value={backendUrl} onChange={e=>setBackendUrl(e.target.value)} />
      </div>
      <div className="form-group">
        <label>company_id</label>
        <input className="input" value={companyId} onChange={e=>setCompanyId(e.target.value)} placeholder="UUID" />
      </div>
      <div className="form-group">
        <label>user_id</label>
        <input className="input" value={userId} onChange={e=>setUserId(e.target.value)} placeholder="UUID" />
      </div>
      {error && <div className="error">{error}</div>}
      <div style={{marginTop:10}}>
        <button className="button" onClick={save}>Guardar</button>
      </div>
    </div>
  )
}
