import { useState } from 'react';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para generar un nuevo ID
  const generateUserId = async () => {
    try {
      const response = await fetch('http://localhost:9000/user');
      const users = await response.json();
      
      // Encontrar el ID más alto y sumar 1
      const maxId = users.reduce((max, user) => {
        const userId = parseInt(user.id);
        return userId > max ? userId : max;
      }, 0);
      
      return (maxId + 1).toString();
    } catch (error) {
      console.error('Error al generar ID:', error);
      return Date.now().toString(); // Fallback usando timestamp
    }
  };

  // Función para verificar si el usuario ya existe
  const checkUserExists = async (username, email) => {
    try {
      const response = await fetch('http://localhost:9000/user');
      const users = await response.json();
      
      const userExists = users.find(user => 
        user.username.toLowerCase() === username.toLowerCase() || 
        user.email.toLowerCase() === email.toLowerCase()
      );
      
      return userExists;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  };

  // Función principal para registrar usuario
  const registerUser = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar si el usuario ya existe
      const existingUser = await checkUserExists(userData.username, userData.email);
      
      if (existingUser) {
        if (existingUser.username.toLowerCase() === userData.username.toLowerCase()) {
          throw new Error('El nombre de usuario ya está en uso');
        }
        if (existingUser.email.toLowerCase() === userData.email.toLowerCase()) {
          throw new Error('El email ya está registrado');
        }
      }

      // Generar nuevo ID
      const newUserId = await generateUserId();

      // Crear objeto de usuario con formato de la base de datos
      const newUser = {
        id: newUserId,
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

      // Enviar datos a JSON Server
      const response = await fetch('http://localhost:9000/user', {
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