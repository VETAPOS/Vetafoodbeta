import React, { useState, useEffect } from 'react'
import IdHeaderForm from '../components/IdHeaderForm'
import SettingsForm from '../components/SettingsForm'
import TopBar from '../components/TopBar'
import Loader from '../components/Loader'
import Notification from '../components/Notification'
import { getSettings, updateSettings } from '../api/settingsApi'

function looksLikeUUID(v){
  if(!v) return false
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
}

export default function SettingsPage(){
  const [ids, setIds] = useState({
    backendUrl: localStorage.getItem('backend_url')||import.meta.env.VITE_BACKEND_URL||'http://127.0.0.1:3000',
    companyId: localStorage.getItem('company_id')||'',
    userId: localStorage.getItem('user_id')||''
  })
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  function onSaveIds(next){
    setIds(next)
    setError(null)
  }

  async function loadSettings(){
    setError(null)
    if(!looksLikeUUID(ids.companyId)) return setError('company_id inválido')
    if(!looksLikeUUID(ids.userId)) return setError('user_id inválido')
    setLoading(true)
    try{
      const data = await getSettings({companyId: ids.companyId, userId: ids.userId})
      setSettings(data)
    }catch(err){
      setError(err.message || 'Error al cargar')
    }finally{ setLoading(false) }
  }

  async function saveChanges(payload){
    setError(null)
    if(!looksLikeUUID(ids.companyId)) return setError('company_id inválido')
    if(!looksLikeUUID(ids.userId)) return setError('user_id inválido')
    setSaving(true)
    try{
      const body = { company_id: ids.companyId, ...payload }
      const resp = await updateSettings({companyId: ids.companyId, userId: ids.userId, payload: body})
      setSettings(resp)
    }catch(err){
      setError(err.message || 'Error al guardar')
    }finally{ setSaving(false) }
  }

  return (
    <div className="root">
      <TopBar />
      <div className="container main">
        <aside className="sidebar card">
          <h3>Conexión</h3>
          <IdHeaderForm onSave={onSaveIds} />
          <div style={{marginTop:8}}>
            <button className="button" onClick={loadSettings}>Cargar configuración</button>
          </div>
          {loading && <div style={{marginTop:8}}><Loader /></div>}
        </aside>

        <main className="content">
          <div className="card">
            <h2>Configuración del negocio</h2>
            {error && <Notification type="error">{error}</Notification>}
            {settings ? (
              <SettingsForm initial={settings} onSave={saveChanges} saving={saving} />
            ) : (
              <div className="muted">No hay configuración cargada. Usa "Cargar configuración".</div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
