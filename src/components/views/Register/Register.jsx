import Button from '@/components/atoms/Button/Button.jsx';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './Register.module.css';

function Register() {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirm) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Validar campos requeridos
    if (!formData.username || !formData.email || !formData.password) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    setIsLoading(true);

    // Preparar datos para el registro
    const userData = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone || '',
      password: formData.password,
      address: {
        street: formData.address || '',
        city: '',
        province: '',
        zipCode: '',
        country: 'Argentina'
      }
    };

    const result = await register(userData);
    
    if (result.success) {
      console.log('Usuario registrado exitosamente:', result.user);
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['container']}>
        <div className={styles['topbar']}>
          <Link to="/">
            <div className={styles['brand']}>AmaZone</div>
          </Link>
          <div className={styles['signin']}>
            ¿Ya tenés cuenta? <Link to="/clients/login">Iniciá sesión</Link>
          </div>
        </div>

        {/* Card */}
        <div className={styles['card']}>
          <h1>Crear Cuenta</h1>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className={styles['error-message']}>
                {error}
              </div>
            )}

            {/* Username */}
            <div className={styles['row']}>
              <div>
                <label htmlFor="username">Nombre de Usuario</label>
                <input
                  id="username"
                  type="text"
                  placeholder="mi_usuario123"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email / Phone */}
            <div className={styles['grid']}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="phone">Teléfono (opcional)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Address */}
            <div className={styles['row']}>
              <div>
                <label htmlFor="address">Dirección (opcional)</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Av. Falsa 123"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Passwords */}
            <div className={styles['grid']}>
              <div>
                <label htmlFor="password">Crear Contraseña</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className={styles['error-message']}>
                {error}
              </div>
            )}

            {/* Botones */}
            <div className={styles['actions']}>
              <Button type="submit" size="m" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </div>
          </form>

          <div className={styles['footer']}>©Copyright 2030. AmaZone LLC.</div>
        </div>
      </div>
    </div>
  );
}

export default Register;
