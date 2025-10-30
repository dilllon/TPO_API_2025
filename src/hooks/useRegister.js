import { useState } from 'react';
import { API_BASE_URL } from '@/config/api';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // FunciÃ³n para verificar si el usuario ya existe
  // Nota: la validaciÃ³n de existencia de usuario se delega al backend.

  // FunciÃ³n principal para registrar usuario
  const registerUser = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const registerPayload = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || "",
        role: "USER"
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || errorData?.error || 'Error al registrar usuario';
        throw new Error(message);
      }

      const authData = await response.json();
      
      setIsLoading(false);
      return {
        success: true,
        auth: authData,
        message: 'Usuario registrado exitosamente'
      };

    } catch (error) {
      setIsLoading(false);
      setError(error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  };

  // FunciÃ³n para limpiar errores
  const clearError = () => {
    setError(null);
  };

  return {
    registerUser,
    isLoading,
    error,
    clearError
  };
}
