import { createContext, useCallback, useMemo } from 'react';
import { useUser } from '@/context/UserContext';
import { useProducts } from '@/context/ProductContext';

const DEFAULT_IMAGE = '/placeholder-product.svg';

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritesContext = createContext(undefined);

const FavoritesProvider = ({ children }) => {
  const {
    favorites: favoriteRecords,
    addFavorite,
    removeFavorite,
    isAuthenticated,
  } = useUser();
  const { productsData } = useProducts();

  const favorites = useMemo(() => {
    if (!Array.isArray(favoriteRecords)) {
      return [];
    }

    return favoriteRecords
      .map((favorite) => {
        const productFromFavorite =
          favorite?.product && typeof favorite.product === 'object'
            ? favorite.product
            : null;

        const productId =
          productFromFavorite?.id ?? favorite?.productId ?? null;

        if (productId === null || productId === undefined) {
          return null;
        }

        const productFromCatalog = productsData.find((item) => item?.id === productId);
        const product = productFromFavorite ?? productFromCatalog ?? null;

        const rawPrice = product?.price ?? null;
        const numericPrice = Number(rawPrice ?? 0);
        const normalizedPrice = Number.isNaN(numericPrice) ? 0 : numericPrice;

        const candidateImages = Array.isArray(product?.images)
          ? product.images.filter((img) => typeof img === 'string' && img.trim() !== '')
          : [];
        const imageSource =
          candidateImages[0] ?? product?.image ?? DEFAULT_IMAGE;

        return {
          id: productId ?? favorite?.id,
          favoriteId: favorite?.id ?? null,
          productId,
          createdAt: favorite?.createdAt ?? null,
          title: product?.title ?? `Producto #${productId ?? ''}`,
          price: normalizedPrice,
          image: imageSource,
          product,
        };
      })
      .filter(Boolean);
  }, [favoriteRecords, productsData]);

  const favoritesCount = favorites.length;

  const addToFavorites = useCallback(
    async (product) => {
      if (!isAuthenticated) {
        return { success: false, error: 'Debes iniciar sesion para agregar favoritos.' };
      }
      if (!product?.id) {
        return { success: false, error: 'Producto invalido.' };
      }
      return addFavorite(product);
    },
    [addFavorite, isAuthenticated]
  );

  const removeFromFavorites = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        return { success: false, error: 'Debes iniciar sesion para quitar favoritos.' };
      }
      if (productId === undefined || productId === null) {
        return { success: false, error: 'Producto invalido.' };
      }
      return removeFavorite(productId);
    },
    [isAuthenticated, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
