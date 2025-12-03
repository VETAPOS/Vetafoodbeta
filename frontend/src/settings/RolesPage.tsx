import React from 'react';
import { Link } from 'react-router-dom';

const mockRoles = [
  { id: '1', name: 'Admin', permissions: ['settings.access'] },
  { id: '2', name: 'Supervisor', permissions: ['settings.access'] },
];

export const RolesPage: React.FC = () => {
  return (
    <section>
      <header className="page-header">
        <div>
          <h2>Roles</h2>
          <p>Controla qué acciones puede hacer cada rol.</p>
        </div>
      </header>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Permisos</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {mockRoles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(', ')}</td>
              <td>
                <Link to={`/ajustes/roles/${role.id}`} className="link">
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
