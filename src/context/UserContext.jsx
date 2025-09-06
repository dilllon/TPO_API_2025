import React, { createContext, use, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const roleToEdit = ["admin", "seller"]

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:9000/user?email=${email}&password=${password}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // En lugar de actualizar solo el producto, refrescamos todos los datos
      const user = await response.json();

      if (user.length === 0) {
        setError("Credenciales inválidas");
        return null;
      }
      setUserData(user[0]);
      console.log("Login exitoso:", user);
      setIsLoading(false);
      setIsAuthenticated(true);
      setError(null);
      return user[0];
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setIsLoading(false);
      setError("Credenciales inválidas");
      return null;
    }
  };

  const canEdit = () => {
    return userData && roleToEdit.includes(userData.role);
  }

  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ userData, isLoading, error, isAuthenticated, login, logout, canEdit }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
}