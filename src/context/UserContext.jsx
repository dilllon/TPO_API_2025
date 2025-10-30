import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from '@/config/api';

const UserContext = createContext(null);

const roleToEdit = ["admin", "seller"];

const normalizeFavoriteRecords = (rawList, fallbackUserId = null) => {
  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const product =
        item.product && typeof item.product === 'object' ? item.product : null;

      const inferredProductId =
        product?.id ??
        item.productId ??
        (typeof item.id === 'number' && (item.title || item.price || item.image) ? item.id : null);

      if (inferredProductId === null || inferredProductId === undefined) {
        return null;
      }

      const favoriteId =
        typeof item.id === 'number' ? item.id : item.favoriteId ?? null;

      return {
        id: favoriteId,
        userId: item.userId ?? fallbackUserId ?? null,
        productId: inferredProductId,
        product,
        createdAt: item.createdAt ?? null,
      };
    })
    .filter(Boolean);
};

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
    if (!saved) {
      return [];
    }
    try {
      const parsed = JSON.parse(saved);
      return normalizeFavoriteRecords(parsed);
    } catch (error) {
      console.warn('No se pudo parsear userFavorites desde localStorage', error);
      return [];
    }
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('userNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  const getFavorites = async (userInfo) => {
    try {
      if (!userInfo || !userInfo.id) {
        console.warn('getFavorites: userInfo o userInfo.id ausente, abortando peticion');
        setFavorites([]);
        return;
      }

      const url = `${API_BASE_URL}/favorites/user/${userInfo.id}`;
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      if (userInfo.token) {
        headers.Authorization = `Bearer ${userInfo.token}`;
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

      const normalizedFavorites = normalizeFavoriteRecords(
        data.favorites,
        userInfo.id
      );
      setFavorites(normalizedFavorites);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      setFavorites([]);
    }
  };

  const getNotifications = async (userInfo) => {
    try {
      if (!userInfo || !userInfo.id) {
        console.warn('getNotifications: userInfo o userInfo.id ausente, abortando peticion');
        setNotifications([]);
        return;
      }

      const url = `${API_BASE_URL}/notifications/user/${userInfo.id}`;
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (userInfo.token) {
        headers['Authorization'] = `Bearer ${userInfo.token}`;
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

  const addFavorite = async (product) => {
    if (!userData || !userData.id) {
      return { success: false, error: 'Debes iniciar sesion para agregar favoritos.' };
    }

    if (!product || !product.id) {
      return { success: false, error: 'Producto invalido.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/user/${userData.id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(userData.token ? { Authorization: `Bearer ${userData.token}` } : {}),
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          errorPayload?.message || errorPayload?.error || `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      const favoriteResponse = await response.json();
      const [normalizedFavorite] = normalizeFavoriteRecords([favoriteResponse], userData.id);

      if (normalizedFavorite) {
        setFavorites((prevFavorites) => {
          const targetProductId = normalizedFavorite.productId ?? normalizedFavorite.product?.id ?? null;

          if (targetProductId === null) {
            return prevFavorites;
          }

          const exists = prevFavorites.some((fav) => {
            const currentProductId = fav.productId ?? fav.product?.id ?? null;
            return currentProductId === targetProductId;
          });

          if (exists) {
            return prevFavorites.map((fav) => {
              const currentProductId = fav.productId ?? fav.product?.id ?? null;
              return currentProductId === targetProductId ? normalizedFavorite : fav;
            });
          }
          return [normalizedFavorite, ...prevFavorites];
        });
      }

      return { success: true, favorite: favoriteResponse };
    } catch (err) {
      console.error('Error al agregar favorito:', err);
      return { success: false, error: err.message || 'No se pudo agregar el favorito.' };
    }
  };

  const removeFavorite = async (productId) => {
    if (!userData || !userData.id) {
      return { success: false, error: 'Debes iniciar sesion para quitar favoritos.' };
    }

    if (productId === undefined || productId === null) {
      return { success: false, error: 'Producto invalido.' };
    }

    const favoriteEntry = favorites.find(
      (favorite) => (favorite.productId ?? favorite.product?.id ?? null) === productId
    );

    if (!favoriteEntry || !favoriteEntry.id) {
      return { success: false, error: 'Favorito no encontrado.' };
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/favorites/user/${userData.id}/favorite/${favoriteEntry.id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            ...(userData.token ? { Authorization: `Bearer ${userData.token}` } : {}),
          },
        }
      );

      if (!response.ok && response.status !== 204) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          errorPayload?.message || errorPayload?.error || `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.productId !== productId));
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
      return { success: false, error: err.message || 'No se pudo eliminar el favorito.' };
    }
  };
  const login = async (username=null, email=null, password) => {
    try {
      setIsLoading(true);
      console.log("Iniciando sesion con:", { username, email, password });
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
        setError("Credenciales invalidas");
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
      console.error("Error al iniciar sesion:", error);
      setIsLoading(false);
      setError("Credenciales invalidas");
      return null;
    }
  };



  // Efecto optimizado para inicializacion y sincronizacion con localStorage
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
            // Pasar el objeto `user` parseado en lugar del estado `userData` (que aun no se ha actualizado)
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

      // Sincronizar favorites (permitir arrays vacios)
      if (favorites !== null) {
        localStorage.setItem('userFavorites', JSON.stringify(favorites));
      }

      // Sincronizar notifications (permitir arrays vacios)
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

    // Limpiar localStorage de forma mas eficiente
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
      addFavorite,
      removeFavorite,
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
