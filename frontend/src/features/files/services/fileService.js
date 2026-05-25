import api from '../../../shared/services/api';

export const getFiles = async () => {
  const response = await api.get('/files');
  return response.data;
};

export const uploadFile = async (formData) => {
  const response = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteFile = async (id) => {
  const response = await api.delete(`/files/${id}`);
  return response.data;
};

export const renameFile = async (id, nombre) => {
  const response = await api.put(`/files/${id}`, { nombre });
  return response.data;
};
