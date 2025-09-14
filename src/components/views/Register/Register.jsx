import Button from '@/components/atoms/Button/Button.jsx';
import Notification from '@/components/atoms/Notification/Notification.jsx';
import { useUser } from '@/context/UserContext';
import { useRegister } from '@/hooks/useRegister';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from './Register.module.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useUser();
  const { registerUser, isLoading, error, clearError } = useRegister();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    address: '',
    password: '',
    confirm: '',
  });

  // Estados para las notificaciones
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'info'
  });

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'info') => {
    setNotification({
      isVisible: true,
      message,
      type
    });
  };

  const closeNotification = () => {
    setNotification({
      isVisible: false,
      message: '',
      type: 'info'
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar errores previos
    clearError();
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirm) {
      showNotification('Las contraseñas no coinciden.', 'error');
      return;
    }

    // Validar campos requeridos
    if (!formData.firstName || !formData.lastName || !formData.username || 
        !formData.email || !formData.password) {
      showNotification('Por favor, completa todos los campos obligatorios.', 'warning');
      return;
    }

    try {
      // Registrar usuario usando el contexto
      const result = await registerUser(formData);
      
      if (result.success) {
        // Registro exitoso
        showNotification(
          `¡Bienvenido ${formData.firstName}! Tu cuenta ha sido creada exitosamente.`, 
          'success'
        );
        
        // Esperar un poco para que el usuario vea la notificación
        setTimeout(() => {
          // Opcional: Iniciar sesión automáticamente
          login({
            username: result.user.username,
            password: result.user.password
          });
          
          // Redirigir al home
          navigate("/");
        }, 2000);
      } else {
        // Mostrar error específico
        showNotification(result.error || 'Error al registrar usuario', 'error');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      showNotification('Error inesperado al registrar usuario', 'error');
    }
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

          {/* Mostrar errores si existen */}
          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              border: '1px solid #e57373'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Nombre / Apellido */}
            <div className={styles['grid']}>
              <div>
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Facundo"
                  autoComplete="off"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Tassone"
                  autoComplete="off"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            {/* Email / Address */}
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
                />
              </div>
              <div>
                <label htmlFor="address">Dirección</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Av. Falsa 123"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Passwords */}
            <div className={styles['row']}>
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
                />
              </div>
              <div>
                <label htmlFor="confirm">Confirmar Contraseña</label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  value={formData.confirm}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div className={styles['actions']}>
              <Button 
                type="submit" 
                size="m" 
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </div>
          </form>

          <div className={styles['footer']}>©Copyright 2030. AmaZone LLC.</div>
        </div>
      </div>

      {/* Componente de notificación */}
      <Notification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
}

export default Register;
