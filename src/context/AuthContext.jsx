import { createContext, useContext, useEffect, useReducer } from 'react';
import { authAPI } from '../services/api.js';

// Estado inicial del contexto de autenticación
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Acciones del reducer
const authActions = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer para manejar el estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case authActions.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case authActions.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case authActions.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case authActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case authActions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay un usuario guardado en localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: authActions.LOGIN_SUCCESS, payload: user });
      } catch (error) {
        localStorage.removeItem('user');
        dispatch({ type: authActions.SET_LOADING, payload: false });
      }
    } else {
      dispatch({ type: authActions.SET_LOADING, payload: false });
    }
  }, []);

  // Función para hacer login
  const login = async (credentials) => {
    dispatch({ type: authActions.LOGIN_START });

    try {
      const user = await authAPI.login(credentials.email, credentials.password);
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: authActions.LOGIN_SUCCESS, payload: user });
      return { success: true, user };

    } catch (error) {
      dispatch({ type: authActions.LOGIN_FAILURE, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: authActions.LOGOUT });
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    dispatch({ type: authActions.LOGIN_START });

    try {
      const user = await authAPI.register(userData);
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: authActions.LOGIN_SUCCESS, payload: user });
      return { success: true, user };

    } catch (error) {
      dispatch({ type: authActions.LOGIN_FAILURE, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    dispatch({ type: authActions.CLEAR_ERROR });
  };

  // Funciones de utilidad para verificar roles
  const isAdmin = () => state.user?.role === 'admin';
  const isSeller = () => state.user?.role === 'seller';
  const isBuyer = () => state.user?.role === 'buyer';
  
  // Solo vendedores pueden editar, y solo sus propios productos
  const canEditProduct = (productSellerId) => {
    console.log('canEditProduct Debug:', {
      isSeller: isSeller(),
      userUsername: state.user?.username,
      userId: state.user?.id,
      userRole: state.user?.role,
      productSellerId,
      match1: state.user?.username === productSellerId,
      match2: state.user?.id === productSellerId
    });
    
    // Comparar tanto con username como con id para máxima compatibilidad
    return isSeller() && (
      state.user?.username === productSellerId || 
      state.user?.id === productSellerId
    );
  };
  
  // Vendedores pueden eliminar sus propios productos, admins pueden eliminar cualquier producto
  const canDeleteProduct = (productSellerId) => {
    if (isAdmin()) return true;
    
    // Comparar tanto con username como con id para máxima compatibilidad
    if (isSeller()) {
      return state.user?.username === productSellerId || 
             state.user?.id === productSellerId;
    }
    
    return false;
  };

  // Valor del contexto
  const value = {
    ...state,
    login,
    logout,
    register,
    clearError,
    isAdmin,
    isSeller,
    isBuyer,
    canEditProduct,
    canDeleteProduct
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
