import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PinModal } from './PinModal';

export const EditUser: React.FC = () => {
  const { id } = useParams();
  const [showPin, setShowPin] = useState(false);

  return (
    <section>
      <h2>Editar Usuario</h2>
      <p>Usuario ID: {id}</p>
      <div className="card">
        <label>Email</label>
        <input defaultValue="admin@veta.dev" />
        <label>Rol</label>
        <select defaultValue="admin">
          <option value="admin">Admin</option>
          <option value="supervisor">Supervisor</option>
        </select>
        <div className="inline">
          <label>
            <input type="checkbox" defaultChecked /> Permiso directo: settings.access
          </label>
        </div>
        <button className="button primary">Guardar</button>
        <button className="button" onClick={() => setShowPin(true)}>
          Definir PIN
        </button>
      </div>
      {showPin && <PinModal onClose={() => setShowPin(false)} onSubmit={(pin) => alert(`PIN guardado: ${pin}`)} />}
    </section>
  );
};
