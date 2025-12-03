import React from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AjustesHome } from './settings/AjustesHome';
import { RolesPage } from './settings/RolesPage';
import { UsersPage } from './settings/UsersPage';
import { EditRole } from './settings/EditRole';
import { EditUser } from './settings/EditUser';
import { useAuth, hasPermission } from './AuthContext';

const ProtectedSettings: React.FC = () => {
  const { permissions } = useAuth();
  if (!hasPermission(permissions, 'settings.access')) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>Menú</h3>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/ajustes">Ajustes</Link>
          </li>
        </ul>
      </aside>
      <main className="content">
        <AjustesHome />
        <Routes>
          <Route path="/ajustes/roles" element={<RolesPage />} />
          <Route path="/ajustes/roles/:id" element={<EditRole />} />
          <Route path="/ajustes/usuarios" element={<UsersPage />} />
          <Route path="/ajustes/usuarios/:id" element={<EditUser />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ajustes/*" element={<ProtectedSettings />} />
      <Route path="/" element={<div className="home">Bienvenido a VetaFoodBeta</div>} />
    </Routes>
  </BrowserRouter>
);
