import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const roleToEdit = ["admin", "seller"]

export function UserProvider({ children }) {
  const [usersData, setUsersData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Iniciando fetch de usuario...");
      const response = await fetch("http://localhost:9000/user");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Usuarios cargados:", data);

      setUsersData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (email, password) => {
    const user = usersData.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      setUserData(user);
      return user
    } else {
      setError("Credenciales inválidas");
      return null;
    }
  };

  const isAuthenticated = () => {
    return userData !== null;
  };

  const canEdit = () => {
    return userData && roleToEdit.includes(userData.role);
  }

  const logout = () => {
    setUserData(null);
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