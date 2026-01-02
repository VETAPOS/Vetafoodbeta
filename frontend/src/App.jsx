import React from 'react'
import { Route } from 'react-router-dom'
import SettingsPage from './pages/SettingsPage'
import RegisterPage from './pages/RegisterPage'

export default function App(){
  return (
    <div>
      <SettingsPage />
      <Route path="/register" element={<RegisterPage/>} />
    </div>
  )
}
