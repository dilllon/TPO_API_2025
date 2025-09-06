// useAuth.jsx - Hook centralizado para autenticación
import { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../services/AuthService';

// Context para autenticación
const AuthContext = createContext();

// Provider del contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializar estado de autenticación
  useEffect(() => {
    const initAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      const authStatus = AuthService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(authStatus);
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      setLoading(true);
      const userData = await AuthService.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const newUser = await AuthService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile,
    // Métodos de verificación de roles
    isAdmin: () => AuthService.isAdmin(),
    canEditProduct: (productUserId) => AuthService.canEditProduct(productUserId),
    canDeleteProduct: () => AuthService.canDeleteProduct(),
    canAddToCart: () => AuthService.canAddToCart(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
