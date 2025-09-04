import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requiredRole, requiredPermission, fallbackPath = "/" }) {
  const { isAuthenticated, user, isAdmin, isSeller, isBuyer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Verificar rol específico si se requiere
    if (requiredRole) {
      let hasRole = false;
      
      switch (requiredRole) {
        case 'admin':
          hasRole = isAdmin();
          break;
        case 'seller':
          hasRole = isSeller();
          break;
        case 'buyer':
          hasRole = isBuyer();
          break;
        default:
          hasRole = false;
      }

      if (!hasRole) {
        navigate(fallbackPath);
        return;
      }
    }

    // Verificar permisos específicos si se requieren
    if (requiredPermission && typeof requiredPermission === 'function') {
      if (!requiredPermission()) {
        navigate(fallbackPath);
        return;
      }
    }
  }, [isAuthenticated, user, requiredRole, requiredPermission, navigate, fallbackPath, isAdmin, isSeller, isBuyer]);

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return children;
}

export default ProtectedRoute;
