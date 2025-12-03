import React from 'react';
import { Link } from 'react-router-dom';

const mockUsers = [
  { id: 'u1', email: 'admin@veta.dev', role: 'Admin', pinEnabled: false },
  { id: 'u2', email: 'supervisor@veta.dev', role: 'Supervisor', pinEnabled: true },
];

export const UsersPage: React.FC = () => {
  return (
    <section>
      <header className="page-header">
        <div>
          <h2>Usuarios</h2>
          <p>Gestiona miembros de tu compañía y sus accesos.</p>
        </div>
      </header>
      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>PIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.pinEnabled ? 'Activo' : 'Sin PIN'}</td>
              <td>
                <Link to={`/ajustes/usuarios/${user.id}`} className="link">
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
