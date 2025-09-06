import React, { createContext, use, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const roleToEdit = ["admin", "seller"]

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const getFavorites = async (userId) => {
    try {
      const response = await fetch(`http://localhost:9000/favorite?userId=${userId}`);
      const data = await response.json();
      if (data[0].favorites.length === 0) {
        setFavorites([]);
        return;
      }
      setFavorites(data[0].favorites);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      setFavorites([]);
      return;
    }
  };

  const getNotifications = async (userId) => {
    try {
      const response = await fetch(`http://localhost:9000/notification?userId=${userId}`);
      const data = await response.json();
      if (data[0].notifications.length === 0) {
        setNotifications([]);
        return;
      }
      setNotifications(data[0].notifications);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      setNotifications([]);
      return;
    }
  };

  const login = async (username=null, email=null, password) => {
    try {
      setIsLoading(true);
      const response = username ? await fetch(`http://localhost:9000/user?username=${username}&password=${password}`) : await fetch(`http://localhost:9000/user?email=${email}&password=${password}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();

      if (user.length === 0) {
        setError("Credenciales inválidas");
        return null;
      }

      setUserData(user[0]);
      setIsAuthenticated(true);
      setError(null);

      await Promise.all([
        getFavorites(user[0].id),
        getNotifications(user[0].id)
      ]);
      setIsLoading(false);
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

  const getRole = () => {
    return userData?.role || null;
  }

  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      isLoading, 
      error, 
      isAuthenticated, 
      login, 
      logout, 
      canEdit,
      notifications,
      favorites,
    }}>
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