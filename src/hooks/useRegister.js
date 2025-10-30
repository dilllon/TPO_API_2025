import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para verificar si el usuario ya existe
  // Nota: la validación de existencia de usuario se delega al backend.

  // Función principal para registrar usuario
  const registerUser = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Crear objeto de usuario con formato de la base de datos
      const newUser = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: "buyer", // Por defecto todos son compradores
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || "", // Opcional
        address: {
          street: userData.address || "",
          city: "",
          province: "",
          zipCode: "",
          country: "Argentina"
        },
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        imageUrl: "https://picsum.photos/50"
      };

      // Enviar datos al backend real
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      const createdUser = await response.json();
      
      setIsLoading(false);
      return {
        success: true,
        user: createdUser,
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

  // Función para limpiar errores
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
