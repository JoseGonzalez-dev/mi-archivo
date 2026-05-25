import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';
import { defineStepper } from '@stepperize/react';

const { useStepper, steps } = defineStepper(
  { id: 'personal', title: 'Información personal', icon: User },
  { id: 'account', title: 'Cuenta', icon: Mail },
  { id: 'security', title: 'Seguridad', icon: Lock }
);

export default function RegisterForm() {
  const stepper = useStepper();
  const { register, handleSubmit, formState: { errors }, trigger, getValues } = useForm();
  const { handleRegister, serverError, loading } = useRegister();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (stepper.state.current.data.id === 'personal') {
      fieldsToValidate = ['nombres', 'apellidos'];
    } else if (stepper.state.current.data.id === 'account') {
      fieldsToValidate = ['email', 'nickname'];
    } else if (stepper.state.current.data.id === 'security') {
      fieldsToValidate = ['password', 'confirmPassword'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      stepper.navigation.next();
    }
  };

  const onSubmit = (data) => {
    handleRegister(data);
  };

  return (
    <div className="auth-card" style={{ maxWidth: '500px' }}>
      <div className="auth-header">
        <h2>Regístrate</h2>
        <p>Completa los pasos para crear tu cuenta segura.</p>
      </div>

      {/* Stepper Header */}
      <div className="stepper-container">
        <div className="stepper-line"></div>
        {stepper.state.all.map((step, index) => {
          const isCompleted = index < stepper.state.current.index;
          const isActive = step.id === stepper.state.current.data.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="stepper-step">
              <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>
              <span className={`step-label ${isActive ? 'active' : ''}`}>{step.title}</span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {stepper.state.current.data.id === 'personal' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>Información personal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Nombre</label>
                <div className="input-container">
                  <input type="text" {...register('nombres', { 
                    required: 'El nombre es obligatorio',
                    minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
                    maxLength: { value: 100, message: 'No debe tener más de 100 caracteres' }
                  })} />
                </div>
                {errors.nombres && <span className="error-text">{errors.nombres.message}</span>}
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <div className="input-container">
                  <input type="text" {...register('apellidos', { 
                    required: 'Los apellidos son obligatorios',
                    minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
                    maxLength: { value: 100, message: 'No debe tener más de 100 caracteres' }
                  })} />
                </div>
                {errors.apellidos && <span className="error-text">{errors.apellidos.message}</span>}
              </div>
            </div>
          </div>
        )}

        {stepper.state.current.data.id === 'account' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>Detalles de cuenta</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Correo electrónico</label>
                <div className="input-container">
                  <input type="email" {...register('email', { 
                    required: 'El correo electrónico es obligatorio',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Formato de correo electrónico inválido'
                    }
                  })} />
                </div>
                {errors.email && <span className="error-text">{errors.email.message}</span>}
              </div>
              <div className="form-group">
                <label>Alias</label>
                <div className="input-container">
                  <input type="text" {...register('nickname', { 
                    required: 'El nickname es obligatorio',
                    minLength: { value: 3, message: 'Debe tener al menos 3 caracteres' },
                    maxLength: { value: 50, message: 'No debe tener más de 50 caracteres' }
                  })} />
                </div>
                {errors.nickname && <span className="error-text">{errors.nickname.message}</span>}
              </div>
            </div>
          </div>
        )}

        {stepper.state.current.data.id === 'security' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>Seguridad</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Password</label>
                <div className="input-container">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...register('password', { 
                      required: 'La contraseña es obligatoria',
                      minLength: { value: 4, message: 'Debe tener al menos 4 caracteres' },
                      validate: {
                        hasUpper: value => /[A-Z]/.test(value) || "Debe contener al menos una mayúscula",
                        hasLower: value => /[a-z]/.test(value) || "Debe contener al menos una minúscula",
                        hasNumber: value => /[0-9]/.test(value) || "Debe contener al menos un número",
                      }
                    })} 
                  />
                  <div className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
                {errors.password && <span className="error-text">{errors.password.message}</span>}
              </div>
              
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-container">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...register('confirmPassword', { 
                      required: 'Por favor confirma tu contraseña',
                      validate: value => value === getValues('password') || 'Las contraseñas no coinciden'
                    })} 
                  />
                  <div className="input-icon-right" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
              </div>
            </div>
            {serverError && <div className="error-text" style={{marginBottom: '1rem'}}>{serverError}</div>}
          </div>
        )}

        <div className="stepper-actions">
          {!stepper.state.isFirst && (
            <button type="button" className="btn-secondary" onClick={stepper.navigation.prev}>Anterior</button>
          )}
          
          {stepper.state.isLast ? (
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} disabled={loading}>
              {loading ? 'Enviando...' : 'Registrarme'}
            </button>
          ) : (
            <button type="button" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleNext}>
              Siguiente
            </button>
          )}
        </div>
      </form>

      <div className="auth-footer" style={{ marginTop: '2rem' }}>
        ¿Ya tienes cuenta? <Link to="/login" className="link">Inicia sesión</Link>
      </div>
    </div>
  );
}
