import React, { createContext, useContext, useEffect, useState } from "react";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [productsData, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:9000/products");
      
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

  // Función para obtener todas las categorías únicas
  const getCategories = () => {
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    return uniqueCategories;
  };

  const canEdit = (id, userId) => {
    return productsData.find(product => product.id == id && product.userId == userId) ? true : false;
  }
  
  
  // Función para obtener productos por categoría
  const getProductsByCategory = (categoryName) => {
    return productsData.filter(product => product.category === categoryName);
  };
  
  // Función para obtener un producto por ID
  const getProductById = (id) => {
    return productsData.find(product => product.id == id);
  };
  
  // Función para obtener productos organizados por categorías (para el grid)
  const getProductsGroupedByCategory = () => {
    const categories = getCategories();
    return categories.map(categoryName => ({
      categoryName,
      products: getProductsByCategory(categoryName)
    }));
  };
    
  // Función para buscar productos por título
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return productsData;
    
    return productsData.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Función para calcular el precio con descuento
  const calculateDiscountedPrice = (product) => {
    if (!product.discount) return product.price;
    return Math.round(product.price * (1 - product.discount / 100));
  };
  
  // Función para verificar si un producto tiene descuento
  const hasDiscount = (product) => {
    return product.discount !== undefined && (product.discount > 0);
  };
  
  // Funcion para actualizar el producto en nuestro modelo de datos
  const updateProduct = async (updated) => {
    try {
      const response = await fetch(`http://localhost:9000/products/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
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

  const addProduct = (product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  return (
    <ProductsContext.Provider value={{ 
      productsData, 
      isLoading,
      error,
      getCategories, 
      getProductsByCategory, 
      getProductById, 
      getProductsGroupedByCategory, 
      searchProducts, 
      calculateDiscountedPrice, 
      hasDiscount, 
      updateProduct, 
      addProduct,
      refreshProducts: fetchProducts,
      canEdit
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