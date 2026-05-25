import { useState } from 'react';
import { X, FileText } from 'lucide-react';

export default function RenameModal({ file, onClose, onRename }) {
  const [newName, setNewName] = useState(file.Nombre);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    if (trimmed === file.Nombre) {
      onClose();
      return;
    }
    setLoading(true);
    try {
      await onRename(file.Id, trimmed);
      onClose();
    } catch {
      setError('Error al renombrar el archivo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <div className="modal-header">
          <div>
            <h3>Renombrar archivo</h3>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Current filename display */}
          <div className="rename-current-file" style={{ marginBottom: '1.25rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: 'rgba(74,222,128,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <FileText size={16} color="var(--primary)" />
            </div>
            <div>
              <span className="rename-label">Nombre actual</span>
              <span className="rename-filename">{file.Nombre}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Nuevo nombre</label>
            <div className="input-container">
              <input
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setError(''); }}
                autoFocus
                style={{ paddingLeft: '1rem' }}
              />
            </div>
            {error && <span className="error-text">{error}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} disabled={loading}>
              {loading ? 'Guardando...' : 'Cambiar nombre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
