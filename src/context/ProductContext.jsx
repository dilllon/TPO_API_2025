import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from '@/config/api';

const ProductsContext = createContext(null);

const buildAuthHeaderValue = (token, tokenType) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return null;
  }

  if (trimmedToken.toLowerCase().startsWith('bearer ')) {
    return trimmedToken;
  }

  const prefix =
    typeof tokenType === 'string' && tokenType.trim().length > 0
      ? tokenType.trim()
      : 'Bearer';

  return `${prefix} ${trimmedToken}`;
};

const buildSearchParams = (filters = {}) => {
  const params = new URLSearchParams();
  const appendIfDefined = (key, value) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    params.append(key, value);
  };

  if (filters.title && typeof filters.title === "string" && filters.title.trim() !== "") {
    appendIfDefined("title", filters.title.trim());
  }

  if (filters.category) {
    appendIfDefined("category", filters.category);
  }

  if (filters.brand) {
    appendIfDefined("brand", filters.brand);
  }

  appendIfDefined("minPrice", filters.minPrice);
  appendIfDefined("maxPrice", filters.maxPrice);

  if (filters.hasStock !== undefined) {
    appendIfDefined("hasStock", filters.hasStock);
  }

  if (filters.hasDiscount !== undefined) {
    appendIfDefined("hasDiscount", filters.hasDiscount);
  }

  return params;
};

export function ProductsProvider({ children }) {
  const [productsData, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Los datos recibidos no son un array');
      }
      
      setProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // FunciÃƒÂ³n para obtener todas las categorÃƒÂ­as ÃƒÂºnicas
  const getCategories = () => {
    const uniqueCategories = [...new Set(
      productsData
        .map(product => product?.category)
        .filter(Boolean)
    )];
    return uniqueCategories.map(category => ({
      label: category,
      href: `#category-${category.toLowerCase().replace(/\s+/g, "-")}`
    }));
  };

  const getCategoryNames = useCallback(() => {
    const names = new Set();
    productsData.forEach(product => {
      if (product?.category) {
        names.add(product.category);
      }
    });
    return Array.from(names).sort((a, b) =>
      (a ?? "").localeCompare(b ?? "", "es-AR", {
        sensitivity: "base",
        numeric: true,
      })
    );
  }, [productsData]);

  const canEdit = (id, userId) => {
    return productsData.find(product => product.id == id && product.userId == userId) ? true : false;
  }

  const canDelete = (id, userId) => {
    return productsData.find(product => product.id == id && product.userId == userId) ? true : false;
  }
  
  
  // FunciÃƒÂ³n para obtener productos por categorÃƒÂ­a
  const getProductsByCategory = (categoryName) => {
    return productsData.filter(product => product.category === categoryName);
  };
  
  // FunciÃƒÂ³n para obtener un producto por ID
  const getProductById = (id) => {
    return productsData.find(product => product.id == id);
  };
  
  // FunciÃƒÂ³n para obtener productos organizados por categorÃƒÂ­as (para el grid)
  const getProductsGroupedByCategory = () => {
    const categories = getCategories();
    return categories.map(({ label: categoryName }) => ({
      categoryName,
      products: getProductsByCategory(categoryName)
    }));
  };

  const getProductsGroupedByOwner = (userId) => {
    const categories = getCategories();
    return categories.map(({ label: categoryName }) => ({
      categoryName,
      products: getProductsByCategory(categoryName).filter(product => product.userId == userId)
    }));
  };

  const getProductsGroupedByDifferentOwner = (userId) => {
    const categories = getCategories();
    return categories.map(({ label: categoryName }) => ({
      categoryName,
      products: getProductsByCategory(categoryName).filter(product => product.userId != userId)
    }));
  };

  const searchProducts = useCallback(async (filters = {}, signal) => {
    try {
      const params = buildSearchParams(filters);
      const queryString = params.toString();
      const endpoint = queryString
        ? `${API_BASE_URL}/products/search?${queryString}`
        : `${API_BASE_URL}/products`;

      const response = await fetch(endpoint, { signal });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || errorData?.error || `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Los datos recibidos no son un array');
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      console.error("Error al buscar productos:", error);
      throw error;
    }
  }, [API_BASE_URL]);
  // FunciÃƒÂ³n para calcular el precio con descuento
  const calculateDiscountedPrice = (product) => {
    if (!product.discount) return product.price;
    return Math.round(product.price * (1 - product.discount / 100));
  };
  
  // FunciÃƒÂ³n para verificar si un producto tiene descuento
  const hasDiscount = (product) => {
    return product.discount !== undefined && (product.discount > 0);
  };
  
  // Funcion para actualizar el producto en nuestro modelo de datos
  const updateProduct = async (updated) => {
    try {
      console.log("Actualizando producto:", JSON.stringify(updated));
      
      const savedUserData = localStorage.getItem('userData');
      let authHeader = null;
      
      if (savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          authHeader = buildAuthHeaderValue(userData.token, userData.type);
        } catch (error) {
          console.warn('Error al parsear userData:', error);
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      };

      const response = await fetch(`${API_BASE_URL}/products/${updated.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updated)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // En lugar de actualizar solo el producto, refrescamos todos los datos
      await fetchProducts();
      return true;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return false;
    }
  };
  

  const lastId = () => {
    if (productsData.length === 0) return 0;
    return Math.max(...productsData.map(p => Number(p.id)));
  }

  const addProduct = async (product) => {
    try {
      const savedUserData = localStorage.getItem('userData');
      let authHeader = null;
      
      if (savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          authHeader = buildAuthHeaderValue(userData.token, userData.type);
        } catch (error) {
          console.warn('Error al parsear userData:', error);
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      };

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdProduct = await response.json();
      
      // Actualizar el estado local con el producto creado
      setProducts(prevProducts => [...prevProducts, createdProduct]);
      
      return {
        success: true,
        product: createdProduct
      };
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Todavia no tenemos back xdxd
      // const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      //   method: 'DELETE'
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // Actualizar el estado local removiendo el producto
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      return true;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return false;
    }
  };

  return (
    <ProductsContext.Provider value={{ 
      productsData, 
      isLoading,
      error,
      getCategories,
      getCategoryNames,
      getProductsByCategory, 
      getProductById, 
      getProductsGroupedByCategory, 
      searchProducts, 
      calculateDiscountedPrice, 
      hasDiscount, 
      updateProduct, 
      addProduct,
      deleteProduct,
      refreshProducts: fetchProducts,
      canEdit,
      canDelete,
      getProductsGroupedByOwner,
      getProductsGroupedByDifferentOwner,
      lastId
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts debe usarse dentro de un ProductsProvider");
  }
  return context;
}
