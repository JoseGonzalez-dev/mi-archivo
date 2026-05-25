import React, { useRef } from 'react';
import { Cloud, X } from 'lucide-react';
import { useFiles } from '../hooks/useFiles';

export default function UploadModal({ onClose }) {
  const { loading, handleFileChange, handleUpload, selectedFile } = useFiles();
  const fileInputRef = useRef(null);

  const onSubmit = async (e) => {
    await handleUpload(e);
    if (!loading) {
      onClose();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3>Subir archivos</h3>
            <p>Selecciona documentos seguros para agregar a Mi Archivo.</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="upload-area">
            <Cloud size={48} className="upload-icon" />
            <h4>Arrastra tus archivos aquí</h4>
            <p>o haz clic para buscar en tu dispositivo local.<br/>Soporte archivos de hasta 5GB • Cifrado de grado militar.</p>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            
            <button type="button" className="btn-primary" style={{ margin: '0 auto' }} onClick={triggerFileInput}>
              Seleccionar archivos
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>ESTADO DEL ARCHIVO</div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {selectedFile ? selectedFile.name : 'No hay archivos seleccionados.'}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={!selectedFile || loading}>
              {loading ? 'Subiendo...' : 'Subir archivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
