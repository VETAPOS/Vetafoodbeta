import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SettingsPage from './pages/SettingsPage'
import RegisterPage from './pages/RegisterPage'
import TopBar from './components/TopBar'

export default function App(){
  return (
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<SettingsPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    </BrowserRouter>
  )
}
