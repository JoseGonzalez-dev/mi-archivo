import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export const useLogin = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const handleLogin = async (data) => {
    try {
      setServerError('');
      const response = await login(data.email, data.password);
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/files');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return {
    handleLogin,
    serverError,
  };
};
