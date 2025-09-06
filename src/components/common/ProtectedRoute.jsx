import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requiredRole, requiredPermission, fallbackPath = "/" }) {
  const { isAuthenticated, user, isAdmin } = useAuth();
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
        case 'user':
          hasRole = user && !isAdmin(); // Usuario regular (no admin)
          break;
        default:
          hasRole = true; // Cualquier usuario autenticado
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
  }, [isAuthenticated, user, requiredRole, requiredPermission, navigate, fallbackPath, isAdmin]);

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return children;
}

export default ProtectedRoute;
