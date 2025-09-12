import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import AuthAlert from '@/components/molecules/AuthAlert/AuthAlert';

export default function ProtectedView({ children }) {
  const { isAuthenticated, isLoading } = useUser();
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  // Si está cargando, mostrar un estado de carga
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado, mostrar el modal
  if (!isAuthenticated) {
    return (
      <>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column'
        }}>
          <h2>Acceso Restringido</h2>
          <p>Esta página requiere que inicies sesión.</p>
          <button 
            onClick={() => setShowAuthAlert(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Iniciar Sesión
          </button>
        </div>
        
        <AuthAlert 
          isVisible={showAuthAlert}
          onClose={() => setShowAuthAlert(false)}
          message="Por favor, inicia sesión para acceder a esta página."
        />
      </>
    );
  }

  return <>{children}</>;
}