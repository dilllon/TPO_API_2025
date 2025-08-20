import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@/components/atoms/Button/Button.jsx';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de login exitoso
    // En un proyecto real harías fetch a tu backend aquí
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);

      // Redirigir al home
      navigate('/r');
    }
  };

  return (
    <div className={styles['auth']}>
      {/* Topbar */}
      <div className={styles['auth-topbar']}>
        <div className={styles['brand']}>
          <span className={styles['brand-name']}>AmaZone</span>
        </div>

        <div className={styles['login-header']}>
          ¿No tenés cuenta? <Link to="/clients/register">Registrate</Link>
        </div>
      </div>

      {/* Modal de login */}
      <main className={`${styles['card']} ${styles['login-card']}`}>
        <h1>Iniciar sesión</h1>

        <form className={styles['form']} onSubmit={handleSubmit}>
          <div className={styles['field']}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          <div className={styles['form-row-meta']}>
            <a href="#" className={styles['link-muted']}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button type="submit" size="m">
            Crear Cuenta
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
