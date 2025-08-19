import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de login exitoso
    // En un proyecto real harías fetch a tu backend aquí
    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      // Redirigir al home
      navigate("/r");
    }
  };

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

      {/* Modal de login */}
      <main className="card login-card">
        <h1>Iniciar sesión</h1>

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
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

          <div className="form_row form_row-meta">
            <a href="#" className="link-muted">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" className="btn btn-primary">
            Ingresar
          </button>
        </form>

        <footer className="card_footer">
          ©Copyright 2030. AmaZone LLC.
        </footer>
      </main>
    </div>
  );
}

export default Login;
