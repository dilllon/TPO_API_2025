import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';

// Hook personalizado para usar el contexto
export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (context === undefined) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }

  const { favorites } = context;

  // Calculamos el estado derivado (la cantidad de favoritos)
  const favoritesCount = favorites.length;

  // Devolvemos el contexto original y el nuevo valor calculado
  return { ...context, favoritesCount };
};
