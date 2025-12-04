import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRoles, RoleDto } from '../api';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <header className="page-header">
        <div>
          <h2>Roles</h2>
          <p>Controla qué acciones puede hacer cada rol.</p>
        </div>
      </header>
      {loading && <div className="loading">Cargando roles...</div>}
      {error && <div className="error">No se pudieron cargar los roles: {error}</div>}
      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Permisos</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.name}</td>
                <td>{role.permissions.map((p) => p.code).join(', ')}</td>
                <td>
                  <Link to={`/ajustes/roles/${role.id}`} className="link">
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
