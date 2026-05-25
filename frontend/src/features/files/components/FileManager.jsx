import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useFiles } from '../hooks/useFiles';
import { FileText, FileSpreadsheet, FileImage, File, MoreVertical, ShieldCheck, CloudUpload, Pencil, Trash2 } from 'lucide-react';
import RenameModal from './RenameModal';
import DeleteModal from './DeleteModal';

export default function FileManager() {
  const { files, handleDelete, handleRename } = useFiles();
  const { activeNav = 'files', searchText, searchSubmitted } = useOutletContext();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renameFile, setRenameFile] = useState(null);
  const [deleteFile, setDeleteFile] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'Nombre', direction: 'asc' });
  const menuRef = useRef(null);

  const sortedFiles = useMemo(() => {
    const compare = (a, b) => {
      const { key, direction } = sortConfig;
      let valueA = a[key];
      let valueB = b[key];

      if (key === 'Tamanyo') {
        valueA = valueA || 0;
        valueB = valueB || 0;
      }

      if (key === 'FechaCreacion') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB, 'es', { sensitivity: 'base' })
          : valueB.localeCompare(valueA, 'es', { sensitivity: 'base' });
      }

      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    };

    return [...files].sort(compare);
  }, [files, sortConfig]);

  const displayedFiles = useMemo(() => {
    const searchFiltered = searchText
      ? sortedFiles.filter((file) => file.Nombre?.toLowerCase().includes(searchText.toLowerCase()))
      : sortedFiles;

    if (activeNav === 'recent') {
      return [...searchFiltered].sort((a, b) => new Date(b.FechaCreacion) - new Date(a.FechaCreacion));
    }

    if (activeNav === 'starred') {
      return searchFiltered.filter((file) => file.Favorito || file.Destacado || file.Starred);
    }

    if (activeNav === 'trash') {
      return [];
    }

    return searchFiltered;
  }, [sortedFiles, activeNav, searchText]);

  const toggleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest('.action-btn')
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return <div className="file-icon pdf"><FileText size={20} /></div>;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <div className="file-icon excel"><FileSpreadsheet size={20} /></div>;
    if (mimeType.includes('image')) return <div className="file-icon image"><FileImage size={20} /></div>;
    if (mimeType.includes('word')) return <div className="file-icon word"><FileText size={20} /></div>;
    return <div className="file-icon"><File size={20} /></div>;
  };

  const formatSize = (bytes) => {
    if (!bytes) return '--';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const toggleMenu = (fileId) => {
    setOpenMenuId(openMenuId === fileId ? null : fileId);
  };

  const onRenameClick = (file) => {
    setOpenMenuId(null);
    setRenameFile(file);
  };

  const onDeleteClick = (file) => {
    setOpenMenuId(null);
    setDeleteFile(file);
  };

  return (
    <div className="file-manager">
      <div className="breadcrumb">
        <span>Mi Archivo</span> &gt; Mis Archivos
      </div>
      
      <h1>Mis Archivos</h1>

      <div className="file-table-container">
        <table className="file-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('Nombre')} style={{ cursor: 'pointer' }}>
                NOMBRE{renderSortIndicator('Nombre')}
              </th>
              <th onClick={() => toggleSort('Tamanyo')} style={{ cursor: 'pointer' }}>
                TAMAÑO{renderSortIndicator('Tamanyo')}
              </th>
              <th onClick={() => toggleSort('FechaCreacion')} style={{ cursor: 'pointer' }}>
                ÚLTIMA MODIFICACIÓN{renderSortIndicator('FechaCreacion')}
              </th>
              <th style={{ textAlign: 'right', width: '60px' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {displayedFiles.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {searchSubmitted && searchText ? 'No se encontró ningún archivo con ese nombre.' : activeNav === 'starred' ? 'No hay archivos destacados.' : activeNav === 'trash' ? 'La papelera está vacía.' : 'No hay archivos subidos.'}
                  </p>
                </td>
              </tr>
            ) : (
              displayedFiles.map(file => (
                <tr key={file.Id}>
                  <td>
                    <div className="file-name-cell">
                      {getFileIcon(file.TipoArchivo)}
                      <div className="file-meta">
                        <span style={{ fontWeight: 500 }}>{file.Nombre}</span>
                        <span className="type">{file.TipoArchivo?.split('/')[1] || 'Documento'}</span>
                      </div>
                    </div>
                  </td>
                  <td>{formatSize(file.Tamanyo)}</td>
                  <td>{formatDate(file.FechaCreacion)}</td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="action-btn"
                      onClick={() => toggleMenu(file.Id)}
                      id={`action-btn-${file.Id}`}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === file.Id && (
                      <div className="action-dropdown" ref={menuRef}>
                        <button className="dropdown-item" onClick={() => onRenameClick(file)}>
                          <Pencil size={14} />
                          Renombrar
                        </button>
                        <button className="dropdown-item dropdown-item-danger" onClick={() => onDeleteClick(file)}>
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {searchSubmitted && searchText && (
        <div className="search-result-info" style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          <strong>Resultados para:</strong> "{searchText}"
        </div>
      )}
      <div className="dashboard-cards">
        <div className="dash-card">
          <ShieldCheck size={48} color="rgba(255,255,255,0.05)" style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '150px', height: '150px' }} />
          <h3>Seguridad Avanzada</h3>
          <p>Tu bóveda de archivos está protegida con cifrado<br/>AES-256 de grado militar. Todos los accesos están<br/>monitoreados.</p>
          <button className="btn-outline">Ver Registro de Seguridad</button>
        </div>

        <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <CloudUpload size={32} color="var(--primary)" />
          </div>
          <h3>Respaldos Diarios</h3>
          <p style={{ marginBottom: '1rem' }}>Próximo respaldo automático en 4 horas.</p>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '75%', height: '100%', backgroundColor: 'var(--primary)' }}></div>
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {renameFile && (
        <RenameModal
          file={renameFile}
          onClose={() => setRenameFile(null)}
          onRename={handleRename}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteFile && (
        <DeleteModal
          file={deleteFile}
          onClose={() => setDeleteFile(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
