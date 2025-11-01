import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../../context/UserContext';
import { useProducts } from '../../../context/ProductContext';
import { API_BASE_URL } from '../../../config/api';
import Header from '../../organisms/Header/Header';
import AddProductForm from '../../atoms/Form/AddProductForm';

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

const normalizeImageList = (primary, rawList) => {
  const items = [];
  if (primary && primary.trim().length > 0) {
    items.push(primary.trim());
  }
  if (rawList && rawList.trim().length > 0) {
    rawList
      .split(/\r?\n|,/)
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => items.push(value));
  }
  return Array.from(new Set(items));
};

function AddProductView() {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useUser();
  const { refreshProducts } = useProducts();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  const tokenInfo = useMemo(() => {
    if (userData?.token) {
      return { token: userData.token, type: userData.type };
    }
    const saved = localStorage.getItem('userData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { token: parsed.token, type: parsed.type };
      } catch (error) {
        console.warn('No se pudo leer userData desde localStorage', error);
      }
    }
    return { token: null, type: null };
  }, [userData]);

  const authHeader = useMemo(
    () => buildAuthHeaderValue(tokenInfo.token, tokenInfo.type),
    [tokenInfo],
  );

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      if (!authHeader) {
        setIsLoadingCategories(false);
        setCategoriesError(
          'No se encontro un token valido para consultar categorias. Puedes ingresar el ID manualmente.',
        );
        return;
      }

      setIsLoadingCategories(true);
      setCategoriesError('');

      try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        if (!isMounted) {
          return;
        }
        if (Array.isArray(payload)) {
          setCategories(
            payload
              .filter((category) => category && typeof category.name === 'string')
              .map((category) => ({ id: category.id, name: category.name })),
          );
        } else {
          setCategories([]);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        console.error('Error al obtener categorias:', error);
        setCategories([]);
        setCategoriesError(
          'No fue posible cargar las categorias existentes. Puedes crear una nueva desde el formulario.',
        );
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    if (isAuthenticated) {
      loadCategories();
    } else {
      setIsLoadingCategories(false);
    }

    return () => {
      isMounted = false;
    };
  }, [authHeader, isAuthenticated]);

  const ensureCategoryId = useCallback(
    async (categoryIdValue, newCategoryName, headers) => {
      const trimmedName = newCategoryName?.trim();
      if (trimmedName) {
        const existing = categories.find(
          (category) => category.name?.toLowerCase() === trimmedName.toLowerCase(),
        );
        if (existing?.id) {
          return existing.id;
        }

        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: trimmedName }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const message =
            payload?.message ||
            payload?.error ||
            `No se pudo crear la categoria (HTTP ${response.status})`;
          throw new Error(message);
        }

        const created = await response.json();
        if (created?.id) {
          setCategories((prev) => [...prev, { id: created.id, name: created.name }]);
          return created.id;
        }
      }

      const trimmedId = categoryIdValue?.toString().trim();
      if (trimmedId) {
        const parsed = Number(trimmedId);
        if (!Number.isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }

      throw new Error('Debes seleccionar una categoria existente o ingresar un nombre nuevo.');
    },
    [categories],
  );

  const handleAddProduct = useCallback(
    async (formData) => {
      if (!isAuthenticated) {
        setErrorMessage('Debes iniciar sesion para crear productos.');
        return false;
      }

      if (!authHeader) {
        setErrorMessage('No se encontro un token valido para autenticar la peticion.');
        return false;
      }

      setIsSubmitting(true);
      setErrorMessage('');

      try {
        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: authHeader,
        };

        const resolvedCategoryId = await ensureCategoryId(
          formData.categoryId,
          formData.newCategoryName,
          headers,
        );

        const images = normalizeImageList(formData.imageUrl, formData.additionalImages);
        const primaryImage = images.length > 0 ? images[0] : null;

        const payload = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: Number.parseFloat(formData.price),
          stock: Number.parseInt(formData.stock, 10),
          categoryId: resolvedCategoryId,
          brand: formData.brand?.trim() || 'Generico',
          warranty: formData.warranty?.trim() || 'Sin garantia',
          userId: userData.id,
          images,
        };

        if (primaryImage) {
          payload.image = primaryImage;
        }

        if (formData.discount !== '') {
          const discountValue = Number.parseFloat(formData.discount);
          if (!Number.isNaN(discountValue) && discountValue >= 0) {
            payload.discount = discountValue;
          }
        }

        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null);
          const message =
            errorPayload?.message ||
            errorPayload?.error ||
            `No se pudo crear el producto (HTTP ${response.status})`;
          throw new Error(message);
        }

        const createdProduct = await response.json();

        toast.success(`Producto "${createdProduct?.title ?? payload.title}" creado correctamente.`, {
          position: 'top-right',
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        await refreshProducts();
        navigate('/');
        return true;
      } catch (error) {
        console.error('Error al crear el producto:', error);
        setErrorMessage(
          error?.message || 'No se pudo crear el producto. Intenta nuevamente mas tarde.',
        );
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [authHeader, ensureCategoryId, isAuthenticated, navigate, refreshProducts, userData?.id],
  );

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Acceso denegado</h2>
          <p>Debes iniciar sesion para agregar productos.</p>
          <button
            onClick={() => navigate('/clients/login')}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          >
            Iniciar sesion
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(248, 113, 113, 0.4)',
            }}
          >
            {errorMessage}
          </div>
        )}

        {categoriesError && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              color: '#1e293b',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.25rem',
              border: '1px solid rgba(148, 163, 184, 0.4)',
              fontSize: '0.9rem',
            }}
          >
            {categoriesError}
          </div>
        )}

        <AddProductForm
          onSubmit={handleAddProduct}
          disabled={isSubmitting}
          categories={categories}
          loadingCategories={isLoadingCategories}
        />

        {isSubmitting && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: '#6c757d',
              fontSize: '0.95rem',
            }}
          >
            Guardando producto...
          </div>
        )}
      </div>
    </>
  );
}

export default AddProductView;

