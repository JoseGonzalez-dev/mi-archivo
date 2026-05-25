import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ file, onClose, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(file.Id);
      onClose();
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal-content">
        <div className="delete-modal-icon">
          <AlertTriangle size={28} color="#f87171" />
        </div>
        <h3 className="delete-modal-title">¿Eliminar archivo?</h3>
        <p className="delete-modal-text">
          ¿Estás seguro de que deseas eliminar{' '}
          <strong>"{file.Nombre}"</strong>?{' '}
          Esta acción no se puede deshacer.
        </p>
        <div className="delete-modal-actions">
          <button
            className="btn-delete-confirm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button className="btn-delete-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
