import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@/components/atoms/Button/Button.jsx';
import styles from './Login.module.css';
import { useUser } from '@/context/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = email.includes('@') ? null : email; // Si incluye '@', es email, sino username
    const user = await login(username, email, password);
    if (user) {
      // Si el login es exitoso, redirigir o hacer algo
      console.log("Login exitoso:", user, user.username, user.imageUrl);
      navigate("/");
    } else {
      // Manejar error de login
      setShowError(true);
      // Ocultar el mensaje de error después de 3 segundos
      setTimeout(() => {
        setShowError(false);
      }, 3000);
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
          <div className={styles['field']}>
            <label htmlFor="emailOrUsername">Email o Nombre de Usuario</label>
            <input
              id="email"
              type="text"
              placeholder="email@ejemplo.com or username"
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
            Iniciar sesion
          </Button>
        </form>

        <footer className={styles['card-footer']}>
          ©Copyright 2030. AmaZone LLC.
        </footer>
      </main>

      {/* Popup de error */}
      {showError && (
        <div className={styles['error-popup']}>
          <div className={styles['error-content']}>
            <p>Email o contraseña incorrectos</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
