import { useNavigate } from 'react-router-dom';
import './LoginAlert.css';

function LoginAlert({ isOpen, onClose, message = "Se debe iniciar sesión para utilizar esta función." }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

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
    <div className="login-alert-overlay" onClick={handleBackdropClick}>
      <div className="login-alert-modal">
        <button className="login-alert-close" onClick={onClose}>
          ×
        </button>
        
        <div className="login-alert-content">
          <div className="login-alert-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="login-alert-title">Autenticación Requerida</h3>
          <p className="login-alert-message">{message}</p>
          
          <div className="login-alert-actions">
            <button 
              className="login-alert-btn login-alert-btn-primary"
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
            <button 
              className="login-alert-btn login-alert-btn-secondary"
              onClick={handleRegister}
            >
              Crear Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAlert;
