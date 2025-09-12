import React, { createContext, use, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const roleToEdit = ["admin", "seller"]

export function UserProvider({ children }) {
  // Inicializar estados con los valores guardados en localStorage
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('userFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('userNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const getFavorites = async (userId) => {
    try {
      const response = await fetch(`http://localhost:9000/favorite?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data === undefined ||data.length === 0) {
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data === undefined || data.length === 0) {
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

      const userData = user[0];
      
      // Guardar en localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      setUserData(userData);
      setIsAuthenticated(true);
      setError(null);

      // Cargar favoritos y notificaciones
      await Promise.all([
        getFavorites(userData.id),
        getNotifications(userData.id)
      ]);

      setIsLoading(false);
      return userData;
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

  // Efecto para guardar los datos en localStorage cuando cambien
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, [userData]);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('userFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('userNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Efecto para cargar datos del usuario si está autenticado al montar el componente
  useEffect(() => {
    const checkSession = async () => {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        const user = JSON.parse(savedUserData);
        setUserData(user);
        setIsAuthenticated(true);
        await Promise.all([
          getFavorites(user.id),
          getNotifications(user.id)
        ]);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const logout = () => {
    // Limpiar el estado
    setUserData(null);
    setIsAuthenticated(false);
    setFavorites([]);
    setNotifications([]);
    
    // Limpiar localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userFavorites');
    localStorage.removeItem('userNotifications');
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