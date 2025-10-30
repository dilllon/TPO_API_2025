import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const roleToEdit = ["admin", "seller"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

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

  const getFavorites = async (userData) => {
    try {
      // Guard: si no hay userData o id, no intentar la petición
      if (!userData || !userData.id) {
        console.warn('getFavorites: userData o userData.id ausente, abortando petición');
        setFavorites([]);
        return;
      }

      const url = `${API_BASE_URL}/favorites/user/${userData.id}`;
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (userData.token) {
        headers['Authorization'] = `Bearer ${userData.token}`;
      }

      console.debug('getFavorites - fetch', { url, headers });

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data) {
        setFavorites([]);
        return;
      }
      console.log("Favoritos obtenidos:", data.favorites);
      setFavorites(data.favorites);
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      setFavorites([]);
      return;
    }
  };

  const getNotifications = async (userData) => {
    try {
      if (!userData || !userData.id) {
        console.warn('getNotifications: userData o userData.id ausente, abortando petición');
        setNotifications([]);
        return;
      }

      const url = `${API_BASE_URL}/notifications/user/${userData.id}`;
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (userData.token) {
        headers['Authorization'] = `Bearer ${userData.token}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const notificationsData = Array.isArray(data)
        ? data
        : Array.isArray(data?.notifications)
          ? data.notifications
          : [];

      if (notificationsData.length === 0) {
        setNotifications([]);
        return;
      }
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      setNotifications([]);
      return;
    }
  };

  const login = async (username=null, email=null, password) => {
    try {
      setIsLoading(true);
      console.log("Iniciando sesión con:", { username, email, password });
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usernameOrEmail: username || email,
        password: password
      })
});
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      // console.log("Respuesta del servidor:", user);

      if (!userData ) {
        setError("Credenciales inválidas");
        return null;
      }

   
      
      // Guardar en localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      setUserData(userData);
      setIsAuthenticated(true);
      setError(null);

      // Cargar favoritos y notificaciones
      await Promise.all([
        getFavorites(userData),
        getNotifications(userData)
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
            // Pasar el objeto `user` parseado en lugar del estado `userData` (que aún no se ha actualizado)
            await Promise.all([
              getFavorites(user),
              getNotifications(user)
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
