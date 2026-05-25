import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Search, Bell, HelpCircle, Upload, AlertTriangle, LogOut, ChevronDown } from 'lucide-react';
import { GenerateInitialsAvatar } from './Avatar';
import UploadModal from '../../features/files/components/UploadModal';
import { getFiles, getFileById } from '../../features/files/services/fileService';

const STORAGE_LIMIT_BYTES = 20 * 1024 * 1024 * 1024; // 20 GB

const formatGB = (bytes) => {
  if (!bytes || bytes < 1024 * 1024) return '0.0 GB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

export default function DashboardLayout() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('files');
  const [storageUsedBytes, setStorageUsedBytes] = useState(0);
  const [filesCount, setFilesCount] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { nombres: 'Usuario', apellidos: '' };

  // Fetch storage usage in real-time (polling every 10 seconds)
  const fetchStorage = useCallback(async () => {
    try {
      const data = await getFiles();
      if (data.success && data.data) {
        const total = data.data.reduce((sum, f) => sum + (f.Tamanyo || 0), 0);
        setStorageUsedBytes(total);
        setFilesCount(Array.isArray(data.data) ? data.data.length : 0);
      }
    } catch {
      // silently fail, will retry next interval
    }
  }, []);

  useEffect(() => {
    fetchStorage();
    const interval = setInterval(fetchStorage, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [fetchStorage]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    setSearchText(trimmed);
    setSearchSubmitted(trimmed.length > 0);
  };

  // Re-fetch storage when upload modal closes (file was likely uploaded)
  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
    setSearchQuery('');
    setSearchText('');
    setSearchSubmitted(false);
    fetchStorage();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const usagePercent = Math.min((storageUsedBytes / STORAGE_LIMIT_BYTES) * 100, 100);
  const storageColor = usagePercent >= 100 ? '#ef4444' : usagePercent >= 80 ? '#f97316' : '#4ade80';
  const showWarning = usagePercent >= 80;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="https://res.cloudinary.com/dzydnoljd/image/upload/v1779730386/LGMIARCHIVO_scqhjq.png" alt="Mi Archivo" />
        </div>

        <button className="btn-primary sidebar-upload-btn" onClick={() => setIsUploadModalOpen(true)}>
          <Upload size={18} />
          Subir
        </button>

        <ul className="nav-menu">
          <li
            className={`nav-item ${activeNav === 'files' ? 'active' : ''}`}
            onClick={() => setActiveNav('files')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            Mis archivos
          </li>
          <li
            className={`nav-item ${activeNav === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveNav('recent')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Recientes
          </li>
          <li
            className={`nav-item ${activeNav === 'starred' ? 'active' : ''}`}
            onClick={() => setActiveNav('starred')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Destacados
          </li>
          <li
            className={`nav-item ${activeNav === 'trash' ? 'active' : ''}`}
            onClick={() => setActiveNav('trash')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Papelera
          </li>
        </ul>

        <div className="storage-indicator">
          <p style={{ color: storageColor, display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
            {showWarning && (
              <AlertTriangle size={14} color={storageColor} fill={storageColor} strokeWidth={2} style={{ flexShrink: 0 }} />
            )}
            {formatGB(storageUsedBytes)} de 20 GB usados
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${usagePercent}%`,
                backgroundColor: storageColor,
                transition: 'width 0.5s ease, background-color 0.5s ease',
              }}
            ></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <Search size={18} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setSearchText('');
                  setSearchSubmitted(false);
                }
              }}
            />
          </form>

          <div className="user-profile" ref={userMenuRef}>
            <Bell size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <HelpCircle size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            <button
              className="user-menu-button"
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
            >
              <div className="user-info">
                <div className="user-details">
                  <span className="user-name">{user.nombres} {user.apellidos}</span>
                  <span className="user-plan">Cuenta Pro</span>
                </div>
                <GenerateInitialsAvatar name={user.nombres} surname={user.apellidos} />
              </div>
              <ChevronDown size={18} color="var(--text-secondary)" />
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                <button className="dropdown-item" type="button" onClick={handleLogout}>
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {activeNav === 'files' && filesCount === 0 && !searchText ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>No hay archivos aun</h2>
              <p style={{ margin: 0 }}>Todavía no has subido archivos. Empieza subiendo tu primer archivo.</p>
            </div>
            <div>
              <button className="btn-primary" onClick={() => setIsUploadModalOpen(true)}>Subir archivo</button>
            </div>
          </div>
        ) : (
          <Outlet context={{
            activeNav,
            setActiveNav,
            searchQuery,
            searchText,
            searchSubmitted,
            setSearchQuery,
          }} />
        )}
      </main>

      {/* Floating Upload Button (FAB) */}
      <button className="fab-upload" onClick={() => setIsUploadModalOpen(true)} title="Subir archivo">
        <Upload size={22} />
      </button>

      {isUploadModalOpen && (
        <UploadModal onClose={handleUploadModalClose} />
      )}
    </div>
  );
}
