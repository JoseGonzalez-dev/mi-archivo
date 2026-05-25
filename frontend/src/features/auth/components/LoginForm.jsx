import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { handleLogin, serverError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Bienvenido de nuevo</h2>
        <p>Ingresa tus credenciales para acceder a tu bóveda segura.</p>
      </div>

      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="form-group">
          <label>Correo electrónico</label>
          <div className="input-container">
            <Mail className="input-icon" size={18} />
            <input 
              type="text" 
              placeholder="nombre@empresa.com"
              {...register('email', { required: 'El correo o alias es obligatorio' })} 
            />
          </div>
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>Contraseña</label>
            <Link to="#" className="link" style={{ fontSize: '0.875rem' }}>¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="input-container">
            <Lock className="input-icon" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })} 
            />
            <div className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </div>

        <div className="auth-options">
          <label className="checkbox-group">
            <input type="checkbox" {...register('remember')} />
            Recordarme por 30 días
          </label>
        </div>

        {serverError && <div className="error-text" style={{marginBottom: '1rem', textAlign: 'center'}}>{serverError}</div>}

        <button type="submit" className="btn-primary">Iniciar sesión</button>
      </form>

      <div className="divider">
        <span>O CONTINUA CON</span>
      </div>

      <div className="social-login">
        <button type="button" className="btn-social">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button type="button" className="btn-social">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.8 1.49.03 2.76.62 3.5 1.69-3.05 1.76-2.54 5.76.51 6.94-.74 1.83-1.6 3.48-2.59 4.34z"/>
            <path d="M12.03 7.25c-.15-2.53 2.09-4.73 4.54-5.06.33 2.62-2.3 4.88-4.54 5.06z"/>
          </svg>
          Apple
        </button>
      </div>

      <div className="auth-footer">
        ¿Nuevo en Mi Archivo? <Link to="/register" className="link">Regístrate</Link>
      </div>
    </div>
  );
}
