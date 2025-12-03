import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, hasPermission } from '../AuthContext';

export const AjustesHome: React.FC = () => {
  const { permissions } = useAuth();
  if (!hasPermission(permissions, 'settings.access')) {
    return null;
  }
  return (
    <section>
      <h1>Ajustes</h1>
      <p>Administra roles, usuarios y permisos.</p>
      <div className="actions">
        <Link to="/ajustes/roles" className="button">
          Roles
        </Link>
        <Link to="/ajustes/usuarios" className="button">
          Usuarios
        </Link>
      </div>
    </section>
  );
};
