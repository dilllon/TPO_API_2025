import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ 
  isVisible, 
  message, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  onClose, 
  autoClose = true,
  duration = 4000 
}) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`notification notification--${type}`}>
      <div className="notification__content">
        <div className="notification__icon">
          {getIcon()}
        </div>
        <div className="notification__message">
          {message}
        </div>
        <button 
          className="notification__close"
          onClick={onClose}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Notification;