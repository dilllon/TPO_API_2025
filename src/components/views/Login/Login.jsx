import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  return (
    <div className="auth">
      {/* Topbar */}
      <div className="auth_topbar">
        <div className="brand">
          <span className="brand_name">AmaZone</span>
        </div>

        <div className="login-header">
          ¿No tenés cuenta? <Link to="/clients/register">Registrate</Link>
        </div>
      </div>

      {/* Modal de registro */}
      <main className="card login-card">
        <h1>Iniciar sesión</h1>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form_row form_row-meta">
            {/* <label className="checkbox">
              <input type="checkbox" />
              <span>Recordarme</span>
            </label> */}

            <a href="#" className="link-muted">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button className="btn btn-primary" type="submit">
            Ingresar
          </button>
        </form>

        <footer className="card_footer">©Copyright 2030. AmaZone LLC.</footer>
      </main>
    </div>
  );
}

export default Login;
