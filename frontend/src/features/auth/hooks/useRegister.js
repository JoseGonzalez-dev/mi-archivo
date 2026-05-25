import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export const useRegister = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data) => {
    try {
      setLoading(true);
      setServerError('');
      const response = await register(data);
      if (response.success) {
        navigate('/login');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    serverError,
    loading
  };
};
