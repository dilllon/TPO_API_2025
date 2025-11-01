import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from '@/context/ProductContext';
import { useUser } from '@/context/UserContext';
import { API_BASE_URL } from '@/config/api';
import './EditProductForm.css';

const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  description: '',
  price: '',
  stock: '',
  discount: '',
  brand: '',
  warranty: '',
  categoryId: '',
  newCategoryName: '',
  image: '',
  additionalImages: '',
};

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

function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productsData, getProductById, updateProduct, isLoading } = useProducts();
  const { userData } = useUser();

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [categoryName, setCategoryName] = useState('');
  const [ownerId, setOwnerId] = useState(null);
  const [originalCategoryId, setOriginalCategoryId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');

  const tokenInfo = useMemo(() => {
    if (userData?.token) {
      return { token: userData.token, type: userData.type };
    }

    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('userData');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { token: parsed?.token ?? null, type: parsed?.type ?? null };
        } catch (error) {
          console.warn('EditProductForm: no se pudo leer userData desde localStorage', error);
        }
      }
    }

    return { token: null, type: null };
  }, [userData]);

  const authHeader = useMemo(
    () => buildAuthHeaderValue(tokenInfo.token, tokenInfo.type),
    [tokenInfo],
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const product = getProductById(id);
    if (!product) {
      setLoadError('Producto no encontrado.');
      setIsReady(false);
      return;
    }

    const additionalImages = Array.isArray(product.images) ? product.images.slice(1) : [];

    setForm({
      id: product.id,
      title: product.title ?? '',
      description: product.description ?? '',
      price:
        product.price !== undefined && product.price !== null
          ? String(product.price)
          : '',
      stock:
        product.stock !== undefined && product.stock !== null
          ? String(product.stock)
          : '',
      discount:
        product.discount !== undefined && product.discount !== null
          ? String(product.discount)
          : '',
      brand: product.brand ?? '',
      warranty: product.warranty ?? '',
      categoryId:
        product.categoryId !== undefined && product.categoryId !== null
          ? String(product.categoryId)
          : '',
      newCategoryName: '',
      image: product.image ?? '',
      additionalImages: additionalImages.join('\n'),
    });
    setCategoryName(product.category ?? '');
    setOwnerId(product.userId ?? null);
    setOriginalCategoryId(product.categoryId ?? null);
    setLoadError('');
    setErrorMessage('');
    setIsReady(true);
  }, [id, getProductById, isLoading, productsData]);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError('');

      try {
        const headers = { Accept: 'application/json' };
        if (authHeader) {
          headers.Authorization = authHeader;
        }

        const response = await fetch(`${API_BASE_URL}/categories`, { headers });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        if (!isMounted) {
          return;
        }

        if (Array.isArray(payload)) {
          const normalized = payload
            .filter((category) => category && typeof category.name === 'string')
            .map((category) => ({ id: category.id, name: category.name }));
          setCategories(normalized);
        } else {
          setCategories([]);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        console.error('EditProductForm: error al obtener categorias', error);
        setCategories([]);
        setCategoriesError(
          'No fue posible cargar las categorias disponibles. Puedes ingresar el ID manualmente.',
        );
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [authHeader]);

  const ensureCategoryId = useCallback(
    async (categoryIdValue, newCategoryNameValue) => {
      const trimmedName = newCategoryNameValue?.trim();
      if (trimmedName) {
        const existing = categories.find(
          (category) => category.name?.toLowerCase() === trimmedName.toLowerCase(),
        );
        if (existing?.id) {
          return existing.id;
        }

        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        if (!authHeader) {
          throw new Error('No se encontro un token valido para crear una nueva categoria.');
        }
        headers.Authorization = authHeader;

        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ name: trimmedName }),
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => null);
          const message =
            errorPayload?.message ||
            errorPayload?.error ||
            `No se pudo crear la categoria (HTTP ${response.status})`;
          throw new Error(message);
        }

        const created = await response.json();
        if (created?.id) {
          setCategories((prev) => [...prev, { id: created.id, name: created.name }]);
          return created.id;
        }

        throw new Error('No se pudo crear la nueva categoria.');
      }

      const trimmedId = categoryIdValue?.toString().trim();
      if (trimmedId) {
        const parsed = Number.parseInt(trimmedId, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          return parsed;
        }
      }

      if (originalCategoryId) {
        return originalCategoryId;
      }

      throw new Error('Debes seleccionar una categoria existente o ingresar un nombre nuevo.');
    },
    [authHeader, categories, originalCategoryId],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!form.title.trim()) {
      setErrorMessage('El titulo es obligatorio.');
      return;
    }

    if (!form.description.trim()) {
      setErrorMessage('La descripcion es obligatoria.');
      return;
    }

    const priceValue = Number.parseFloat(form.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setErrorMessage('Ingresa un precio valido.');
      return;
    }

    const stockValue = Number.parseInt(form.stock, 10);
    if (Number.isNaN(stockValue) || stockValue < 0) {
      setErrorMessage('Ingresa un stock valido.');
      return;
    }

    let discountValue = null;
    if (form.discount !== '') {
      const parsedDiscount = Number.parseFloat(form.discount);
      if (Number.isNaN(parsedDiscount) || parsedDiscount < 0) {
        setErrorMessage('Ingresa un descuento valido o deja el campo vacio.');
        return;
      }
      discountValue = parsedDiscount;
    }

    setIsSubmitting(true);

    try {
      const resolvedCategoryId = await ensureCategoryId(form.categoryId, form.newCategoryName);

      const images = normalizeImageList(form.image, form.additionalImages);
      const primaryImage = images.length > 0 ? images[0] : null;

      const payload = {
        id: form.id,
        title: form.title.trim(),
        description: form.description.trim(),
        price: priceValue,
        stock: stockValue,
        brand: form.brand?.trim() ?? '',
        warranty: form.warranty?.trim() ?? '',
        categoryId: resolvedCategoryId,
        image: primaryImage,
        images,
      };

      if (discountValue !== null) {
        payload.discount = discountValue;
      }

      if (ownerId !== null && ownerId !== undefined) {
        payload.userId = ownerId;
      }

      const success = await updateProduct(payload);
      if (!success) {
        throw new Error('No se pudo actualizar el producto.');
      }

      navigate(-1);
    } catch (error) {
      console.error('EditProductForm: error al actualizar el producto', error);
      setErrorMessage(error?.message || 'No se pudo actualizar el producto. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((isLoading && !isReady) || (!isReady && !loadError)) {
    return (
      <div className="edit-product-form">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="edit-product-form">
        <div className="error-banner">{loadError}</div>
        <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="edit-product-form">
      <h2>Editar producto: {form.title || 'Producto'}</h2>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      {categoriesError && <div className="info-banner">{categoriesError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titulo</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripcion</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleChange}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="discount">Descuento (%)</label>
          <input
            id="discount"
            name="discount"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={form.discount}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="0 para sin descuento"
          />
        </div>

        <div className="form-group">
          <label htmlFor="brand">Marca</label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={form.brand}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="warranty">Garantia</label>
          <input
            id="warranty"
            name="warranty"
            type="text"
            value={form.warranty}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">ID de categoria</label>
          <input
            id="categoryId"
            name="categoryId"
            type="text"
            value={form.categoryId}
            onChange={handleChange}
            disabled={isSubmitting}
            list={categories.length > 0 ? 'edit-category-options' : undefined}
            placeholder="Ingresa el ID de la categoria"
          />
          {categories.length > 0 && (
            <datalist id="edit-category-options">
              {categories.map(({ id: categoryId, name }) => (
                <option key={categoryId} value={categoryId}>
                  {name}
                </option>
              ))}
            </datalist>
          )}
          {categoryName && (
            <p className="helper-text">Categoria actual: {categoryName}</p>
          )}
          {isLoadingCategories && (
            <p className="helper-text">Cargando categorias...</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newCategoryName">Crear nueva categoria (opcional)</label>
          <input
            id="newCategoryName"
            name="newCategoryName"
            type="text"
            value={form.newCategoryName}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Ingresa un nombre para crear una nueva categoria"
          />
          <p className="helper-text">
            Si completas este campo, se creara una nueva categoria y se asociara al producto.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="image">Imagen principal (URL)</label>
          <input
            id="image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalImages">Imagenes adicionales (una por linea)</label>
          <textarea
            id="additionalImages"
            name="additionalImages"
            rows={4}
            value={form.additionalImages}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder={'https://...\nhttps://...'}
          />
          <p className="helper-text">
            El primer enlace se usara como imagen principal. Puedes separar las imagenes por linea o por coma.
          </p>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductForm;
