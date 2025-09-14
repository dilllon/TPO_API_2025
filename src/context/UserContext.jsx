import React, { createContext, useContext, useEffect, useState } from "react";

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



  // Efecto optimizado para inicialización y sincronización con localStorage
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        const savedUserData = localStorage.getItem('userData');
        const savedAuth = localStorage.getItem('isAuthenticated');
        
        if (savedUserData && savedAuth === 'true') {
          const user = JSON.parse(savedUserData);
          setUserData(user);
          setIsAuthenticated(true);
          
          // Solo cargar datos remotos si no los tenemos en localStorage
          const savedFavorites = localStorage.getItem('userFavorites');
          const savedNotifications = localStorage.getItem('userNotifications');
          
          if (!savedFavorites || !savedNotifications) {
            await Promise.all([
              getFavorites(user.id),
              getNotifications(user.id)
            ]);
          }
        }
      } catch (error) {
        console.error('Error al inicializar usuario:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []); // Solo se ejecuta al montar

  // Efecto para sincronizar con localStorage cuando los datos cambien
  useEffect(() => {
    // Solo sincronizar si no estamos en el estado de carga inicial
    if (!isLoading) {
      // Sincronizar userData e isAuthenticated
      if (userData && isAuthenticated) {
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
      } else if (!isAuthenticated) {
        localStorage.removeItem('userData');
        localStorage.removeItem('isAuthenticated');
      }
      
      // Sincronizar favorites (permitir arrays vacíos)
      if (favorites !== null) {
        localStorage.setItem('userFavorites', JSON.stringify(favorites));
      }
      
      // Sincronizar notifications (permitir arrays vacíos)
      if (notifications !== null) {
        localStorage.setItem('userNotifications', JSON.stringify(notifications));
      }
    }
  }, [userData, isAuthenticated, favorites, notifications, isLoading]);

  const logout = () => {
    // Limpiar el estado en un solo batch
    setUserData(null);
    setIsAuthenticated(false);
    setFavorites([]);
    setNotifications([]);
    setError(null);
    
    // Limpiar localStorage de forma más eficiente
    const keysToRemove = ['userData', 'isAuthenticated', 'userFavorites', 'userNotifications'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  return (
    <UserContext.Provider value={{ 
      userData, 
      isLoading, 
      error, 
      isAuthenticated, 
      login, 
      logout, 
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