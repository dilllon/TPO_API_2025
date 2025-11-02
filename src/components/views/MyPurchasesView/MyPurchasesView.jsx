import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useProducts } from '@/context/ProductContext';
import { API_BASE_URL } from '@/config/api';
import Header from '../../organisms/Header/Header';
import './MyPurchasesView.css';
import AuthAlert from '../../molecules/AuthAlert/AuthAlert';

const DEFAULT_IMAGE = '/placeholder-product.svg';

const buildAuthHeaderValue = (token, type) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const trimmed = token.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.toLowerCase().startsWith('bearer ')) {
    return trimmed;
  }

  const prefix = typeof type === 'string' && type.trim().length > 0 ? type.trim() : 'Bearer';
  return `${prefix} ${trimmed}`;
};

function MyPurchases() {
  const { isAuthenticated, isLoading, userData } = useUser();
  const { productsData } = useProducts();
  const [purchases, setPurchases] = useState([]);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const formatPrice = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }

    if (typeof value === 'string') {
      const numeric = Number(value);
      if (!Number.isNaN(numeric)) {
        return numeric.toFixed(2);
      }
    }

    return '--';
  };

  const formatDate = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed.toLocaleString();
  };

  const getInitial = (label) => {
    if (typeof label !== 'string') return '?';
    const trimmed = label.trim();
    if (!trimmed) return '?';
    return trimmed.charAt(0).toUpperCase();
  };

  const tokenInfo = useMemo(() => {
    if (userData?.token) {
      return { token: userData.token, type: userData.type };
    }

    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('userData');
        if (saved) {
          const parsed = JSON.parse(saved);
          return { token: parsed?.token ?? null, type: parsed?.type ?? null };
        }
      } catch (error) {
        console.warn('MyPurchases: no se pudo leer userData desde localStorage', error);
      }
    }

    return { token: null, type: null };
  }, [userData]);

  const authHeader = useMemo(
    () => buildAuthHeaderValue(tokenInfo.token, tokenInfo.type),
    [tokenInfo],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setPurchases([]);
      setFetchError('');
      return;
    }

    if (!authHeader) {
      setPurchases([]);
      setFetchError('No se encontro un token valido para obtener el historial de compras.');
      return;
    }

    const fetchPurchases = async () => {
      setIsFetching(true);
      setFetchError('');

      try {
        const response = await fetch(`${API_BASE_URL}/purchases/mine`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });

        if (response.status === 401 || response.status === 403) {
          throw new Error('No se pudo obtener el historial de compras. Revisa tus permisos o inicia sesion nuevamente.');
        }

        if (!response.ok) {
          throw new Error(`No se pudo obtener el historial de compras (HTTP ${response.status}).`);
        }

        const payload = await response.json();
        if (!Array.isArray(payload)) {
          setPurchases([]);
          return;
        }

        const normalizedItems = payload.flatMap((purchase) => {
          if (!purchase || !Array.isArray(purchase.items) || purchase.items.length === 0) {
            return [];
          }

          const purchaseId = purchase.id ?? null;
          const createdAt = purchase.createdAt ?? null;
          const totalPrice = purchase.totalPrice ?? null;

          return purchase.items.map((item) => ({
            purchaseId,
            purchaseCreatedAt: createdAt,
            purchaseTotalPrice: totalPrice,
            productId: item?.productId ?? null,
            productTitle: item?.productTitle ?? item?.title ?? '',
            qty: item?.qty ?? 0,
            unitPrice: item?.unitPrice ?? null,
            lineTotal: item?.lineTotal ?? null,
            thumbnail: item?.thumbnail ?? item?.image ?? null,
          }));
        });

        setPurchases(normalizedItems);
      } catch (error) {
        console.error('Error al traer compras:', error);
        setPurchases([]);
        setFetchError(error?.message || 'No se pudo obtener el historial de compras.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchPurchases();
  }, [API_BASE_URL, authHeader, isAuthenticated]);

  const productMediaById = useMemo(() => {
    if (!Array.isArray(productsData)) {
      return new Map();
    }

    const map = new Map();
    productsData.forEach((product) => {
      if (product === null || product === undefined) {
        return;
      }

      const identifier = product.id;
      if (identifier === null || identifier === undefined) {
        return;
      }

      const key = String(identifier);
      const candidateImages = Array.isArray(product.images)
        ? product.images
            .map((img) => {
              if (typeof img === 'string') {
                const trimmed = img.trim();
                return trimmed.length > 0 ? trimmed : null;
              }
              if (img && typeof img === 'object') {
                const value =
                  typeof img.url === 'string'
                    ? img.url.trim()
                    : typeof img.src === 'string'
                      ? img.src.trim()
                      : null;
                return value && value.length > 0 ? value : null;
              }
              return null;
            })
            .filter((img) => typeof img === 'string' && img.length > 0)
        : [];
      const primaryImage = candidateImages[0] ?? product.thumbnail ?? product.image ?? null;

      map.set(key, {
        image: primaryImage,
        title: product?.title ?? '',
      });
    });

    return map;
  }, [productsData]);

  const purchasesForDisplay = useMemo(() => {
    if (!Array.isArray(purchases) || purchases.length === 0) {
      return [];
    }

    return purchases.map((item) => {
      if (!item) {
        return null;
      }

      const key = item.productId !== null && item.productId !== undefined ? String(item.productId) : null;
      const productMeta = key ? productMediaById.get(key) : null;

      const displayTitle = (() => {
        const title = typeof item.productTitle === 'string' && item.productTitle.trim().length > 0
          ? item.productTitle
          : null;

        if (title) {
          return title;
        }

        if (productMeta?.title) {
          return productMeta.title;
        }

        if (item.productId !== null && item.productId !== undefined) {
          return `Producto ${item.productId}`;
        }

        return 'Producto';
      })();

      const displayImage = item.thumbnail ?? productMeta?.image ?? null;

      return {
        ...item,
        displayTitle,
        displayImage,
      };
    }).filter(Boolean);
  }, [purchases, productMediaById]);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = DEFAULT_IMAGE;
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthAlert(true);
    }
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <Header />
      <main className="mypurchases-container">
        <h2>Mis compras</h2>

        {isFetching && <div className="mypurchases-loading">Cargando historial...</div>}

        {fetchError && <div className="mypurchases-error">{fetchError}</div>}

        {purchasesForDisplay.length === 0 && !isFetching ? (
          <div className="mypurchases-empty">No tenes compras registradas.</div>
        ) : null}

        {purchasesForDisplay.length > 0 && (
          <ul className="mypurchases-list">
            {purchasesForDisplay.map((item, index) => {
              const key = `${item.purchaseId ?? 'purchase'}-${item.productId ?? 'product'}-${index}`;
              const purchaseDate = formatDate(item.purchaseCreatedAt);
              const displayImage = item.displayImage ?? null;

              return (
                <li key={key} className="mypurchases-item">
                  <div className="mypurchases-thumb">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={item.displayTitle || 'Producto'}
                        onError={handleImageError}
                      />
                    ) : (
                      <span>{getInitial(item.displayTitle)}</span>
                    )}
                  </div>
                  <div className="mypurchases-info">
                    <h3>{item.displayTitle}</h3>
                    {item.purchaseId ? (
                      <p>
                        Compra #{item.purchaseId}
                        {purchaseDate ? ` - ${purchaseDate}` : ''}
                      </p>
                    ) : null}
                    <p>Cantidad: {item.qty ?? '--'}</p>
                    <p>Precio unitario: ${formatPrice(item.unitPrice)}</p>
                    <p>Total pagado: ${formatPrice(item.lineTotal ?? item.unitPrice)}</p>
                    {item.purchaseTotalPrice ? (
                      <p>Total de la compra: ${formatPrice(item.purchaseTotalPrice)}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <AuthAlert
        isVisible={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
        message="Debes iniciar sesion para ver tus compras"
      />
    </>
  );
}

export default MyPurchases;
