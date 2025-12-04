import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, UserDto } from '../api';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <header className="page-header">
        <div>
          <h2>Usuarios</h2>
          <p>Gestiona miembros de tu compañía y sus accesos.</p>
        </div>
      </header>
      {loading && <div className="loading">Cargando usuarios...</div>}
      {error && <div className="error">No se pudieron cargar los usuarios: {error}</div>}
      {!loading && !error && (
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role?.name || 'Sin rol'}</td>
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
      )}
    </section>
  );
};
