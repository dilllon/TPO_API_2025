import Button from '@/components/atoms/Button/Button.jsx';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import styles from './Login.module.css';

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailOrUsername && password) {
      setIsLoading(true);
      clearError();

      // Determinar si es email o username - convertir username a email si es necesario
      let email = emailOrUsername;
      if (!emailOrUsername.includes('@')) {
        // Si no contiene @, asumir que es username y buscar el email correspondiente
        // Para esto usaremos las credenciales de prueba conocidas
        const userMap = {
          'comprador': 'comprador@gmail.com',
          'vendedor': 'vendedor@gmail.com', 
          'admin': 'admin@gmail.com'
        };
        email = userMap[emailOrUsername] || emailOrUsername;
      }

      const result = await login({ email, password });
      
      if (result.success) {
        // Navegar según el rol del usuario
        navigate('/');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['auth']}>
      {/* Topbar */}
      <div className={styles['auth-topbar']}>
        <Link to="/">
          <div className={styles['brand']}>
            <span className={styles['brand-name']}>AmaZone</span>
          </div>
        </Link>

        <div className={styles['login-header']}>
          ¿No tenés cuenta? <Link to="/clients/register">Registrate</Link>
        </div>
      </div>

      {/* Modal de login */}
      <main className={`${styles['card']} ${styles['login-card']}`}>
        <h1>Iniciar sesión</h1>

        <form className={styles['form']} onSubmit={handleSubmit}>
          {error && (
            <div className={styles['error-message']}>
              {error}
            </div>
          )}
          
          <div className={styles['field']}>
            <label htmlFor="emailOrUsername">Email o Nombre de Usuario</label>
            <input
              id="emailOrUsername"
              type="text"
              placeholder="email@ejemplo.com o mi_usuario123"
              autoComplete="username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles['field']}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles['form-row-meta']}>
            <a href="#" className={styles['link-muted']}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button type="submit" size="m" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <footer className={styles['card-footer']}>
          ©Copyright 2030. AmaZone LLC.
        </footer>
      </main>
    </div>
  );
}

export default Login;
