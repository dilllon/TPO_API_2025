// AuthAlert.jsx - Componente de alerta para usuarios no autenticados
import { useNavigate } from 'react-router-dom';
import './AuthAlert.css';

function AuthAlert({ isVisible, onClose, message = "Se debe iniciar sesión para utilizar esta función." }) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-alert-overlay" onClick={handleBackdropClick}>
      <div className="auth-alert-modal">
        <div className="auth-alert-header">
          <h3>🔐 Acceso Requerido</h3>
          <button 
            className="auth-alert-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        
        <div className="auth-alert-body">
          <p>{message}</p>
          <div className="auth-alert-icon">
            👤
          </div>
        </div>
        
        <div className="auth-alert-actions">
          <button 
            className="auth-alert-btn auth-alert-btn-primary"
            onClick={handleLogin}
          >
            Iniciar Sesión
          </button>
          <button 
            className="auth-alert-btn auth-alert-btn-secondary"
            onClick={handleRegister}
          >
            Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthAlert;
