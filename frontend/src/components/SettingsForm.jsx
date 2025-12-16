import React, { useState, useEffect } from 'react'

export default function SettingsForm({initial, onSave, saving}){
  const [timezone, setTimezone] = useState(initial?.timezone||'America/Mexico_City')
  const [currency, setCurrency] = useState(initial?.currency||'MXN')
  const [allowOffline, setAllowOffline] = useState(initial?.allow_offline ?? true)
  const [offlineDays, setOfflineDays] = useState(initial?.offline_days_limit ?? 3)

  useEffect(()=>{
    setTimezone(initial?.timezone||'America/Mexico_City')
    setCurrency(initial?.currency||'MXN')
    setAllowOffline(initial?.allow_offline ?? true)
    setOfflineDays(initial?.offline_days_limit ?? 3)
  }, [initial])

  function save(){
    const payload = { timezone, currency, allow_offline: allowOffline, offline_days_limit: Number(offlineDays) }
    onSave(payload)
  }

  return (
    <div className="card">
      <h3>Configuración del negocio</h3>
      <div className="form-group">
        <label>Timezone</label>
        <input className="input" value={timezone} onChange={e=>setTimezone(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Currency</label>
        <input className="input" value={currency} onChange={e=>setCurrency(e.target.value)} />
      </div>
      <div className="form-group">
        <label>
          <input type="checkbox" checked={allowOffline} onChange={e=>setAllowOffline(e.target.checked)} /> Allow offline
        </label>
      </div>
      <div className="form-group">
        <label>Offline days limit</label>
        <input className="input" type="number" value={offlineDays} onChange={e=>setOfflineDays(e.target.value)} />
      </div>
      <div>
        <button className="button" onClick={save} disabled={saving}>{saving? 'Guardando...':'Guardar cambios'}</button>
      </div>
    </div>
  )
}
