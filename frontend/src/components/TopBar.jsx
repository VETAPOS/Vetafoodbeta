import React from 'react'
import { Link } from 'react-router-dom'

export default function TopBar(){
  return (
    <header className="topbar">
      <div className="container">
        <div className="brand">Veta POS</div>
        <nav className="nav">
          <Link to="/" className="nav-item">Configuración</Link>
          <Link to="/register" className="nav-item register">Registrarse</Link>
        </nav>
      </div>
    </header>
  )
}
