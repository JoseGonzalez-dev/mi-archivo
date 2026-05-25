import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFiles, uploadFile, deleteFile, renameFile } from '../services/fileService';

export const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFiles = useCallback(async () => {
    try {
      const data = await getFiles();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchFiles();

    const handleFilesUpdated = () => {
      fetchFiles();
    };

    window.addEventListener('files-updated', handleFilesUpdated);
    return () => window.removeEventListener('files-updated', handleFilesUpdated);
  }, [fetchFiles]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      await uploadFile(formData);
      setSelectedFile(null);
      await fetchFiles();
      window.dispatchEvent(new Event('files-updated'));
      return true; // upload success
    } catch (error) {
      console.error('Error uploading file', error);
      alert(error.response?.data?.message || 'Error al subir archivo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFile(id);
      await fetchFiles();
      window.dispatchEvent(new Event('files-updated'));
    } catch (error) {
      console.error('Error deleting file', error);
    }
  };

  const handleRename = async (id, nombre) => {
    try {
      await renameFile(id, nombre);
      await fetchFiles();
      window.dispatchEvent(new Event('files-updated'));
    } catch (error) {
      console.error('Error renaming file', error);
      throw error;
    }
  };

  // Compute storage used in bytes
  const storageUsedBytes = files.reduce((sum, f) => sum + (f.Tamanyo || 0), 0);

  return {
    files,
    selectedFile,
    loading,
    storageUsedBytes,
    handleFileChange,
    handleUpload,
    handleDelete,
    handleRename,
  };
};
