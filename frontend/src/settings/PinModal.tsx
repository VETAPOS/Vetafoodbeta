import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  onSubmit: (pin: string) => void;
}

export const PinModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [pin, setPin] = useState('');
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Autorizar acción</h3>
        <p>Ingresa el PIN del gerente para aprobar.</p>
        <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" />
        <div className="modal-actions">
          <button className="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="button primary" onClick={() => onSubmit(pin)}>
            Aprobar
          </button>
        </div>
      </div>
    </div>
  );
};
