import React, { useState } from 'react'
import { registerStep1, registerStep2 } from '../api/authApi'

export default function RegisterPage(){
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [companyId, setCompanyId] = useState(null)
  const [token, setToken] = useState(null)

  const [form1, setForm1] = useState({ business_name:'', email:'', phone_country_code:'+52', phone_number:'', password:'' })
  const [form2, setForm2] = useState({ contact_name:'', business_type:'' })

  async function onStep1(){
    setError(null); setLoading(true)
    const res = await registerStep1(form1)
    const data = await res.json().catch(()=>null)
    setLoading(false)
    if(res.status === 201){
      setCompanyId(data.company_id); setToken(data.registration_token); setStep(2)
    } else {
      setError(data?.error || 'Unknown error')
    }
  }

  async function onStep2(){
    setError(null); setLoading(true)
    const payload = { company_id: companyId, ...form2 }
    const res = await registerStep2(payload, token)
    const data = await res.json().catch(()=>null)
    setLoading(false)
    if(res.status === 200){
      alert('Registration completed')
      // optionally redirect
    } else {
      setError(data?.error || 'Unknown error')
    }
  }

  return (
    <div style={{maxWidth:700, margin:'40px auto', padding:20}}>
      <h2>Registro - Paso {step}</h2>
      {error && <div style={{color:'red',marginBottom:10}}>{error}</div>}
      {step === 1 && (
        <div>
          <label>Nombre del negocio</label>
          <input value={form1.business_name} onChange={e=>setForm1({...form1, business_name:e.target.value})} />
          <label>Email</label>
          <input value={form1.email} onChange={e=>setForm1({...form1, email:e.target.value})} />
          <label>Lada</label>
          <input value={form1.phone_country_code} onChange={e=>setForm1({...form1, phone_country_code:e.target.value})} />
          <label>Teléfono</label>
          <input value={form1.phone_number} onChange={e=>setForm1({...form1, phone_number:e.target.value})} />
          <label>Password</label>
          <input type="password" value={form1.password} onChange={e=>setForm1({...form1, password:e.target.value})} />
          <div style={{marginTop:10}}>
            <button onClick={onStep1} disabled={loading}>{loading? 'Enviando...':'Continuar'}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div>Company id: {companyId}</div>
          <label>Nombre de contacto</label>
          <input value={form2.contact_name} onChange={e=>setForm2({...form2, contact_name:e.target.value})} />
          <label>Tipo de negocio</label>
          <select value={form2.business_type} onChange={e=>setForm2({...form2, business_type:e.target.value})}>
            <option value="">Selecciona</option>
            <option value="RESTAURANTE_QSR">Restaurante QSR</option>
            <option value="TIENDA_RETAIL">Tienda Retail</option>
          </select>
          <div style={{marginTop:10}}>
            <button onClick={onStep2} disabled={loading}>{loading? 'Enviando...':'Finalizar registro'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
