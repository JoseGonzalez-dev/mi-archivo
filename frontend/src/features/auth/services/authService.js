import api from '../../../shared/services/api';

export const login = async (identifier, password) => {
  const response = await api.post('/auth/login', {
    identifier,
    password,
  });
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};
