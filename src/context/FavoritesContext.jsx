import { createContext, useState } from 'react';

// Crear el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext();

// Proveedor del contexto
const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Función para agregar un producto a favoritos
  const addToFavorites = (product) => {
    if (!favorites.find((fav) => fav.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  // Función para eliminar un producto de favoritos
  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter((fav) => fav.id !== productId));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
