import React from 'react';
import { useParams } from 'react-router-dom';

const permissions = ['settings.access'];

export const EditRole: React.FC = () => {
  const { id } = useParams();
  return (
    <section>
      <h2>Editar Rol</h2>
      <p>Rol ID: {id}</p>
      <div className="card">
        {permissions.map((perm) => (
          <label key={perm} className="switch">
            <input type="checkbox" defaultChecked />
            <span>{perm}</span>
          </label>
        ))}
      </div>
      <button className="button primary">Guardar</button>
    </section>
  );
};
