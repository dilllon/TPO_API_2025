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
      console.log("Iniciando fetch de productos...");
      const response = await fetch("http://localhost:9000/products");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Productos cargados:", data);
      
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
    console.log("ProductsProvider montado");
    fetchProducts();
  }, []);

  // Función para obtener todas las categorías únicas
  const getCategories = () => {
    const uniqueCategories = [...new Set(productsData.map(product => product.category))];
    return uniqueCategories;
  };
  
  
  // Función para obtener productos por categoría
  const getProductsByCategory = (categoryName) => {
    return productsData.filter(product => product.category === categoryName);
  };
  
  // Función para obtener un producto por ID
  const getProductById = (id) => {
    return productsData.find(product => product.id === id);
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
    return product.discount && product.discount > 0;
  };
  
  // Funcion para actualizar el producto en nuestro modelo de datos
  const updateProduct = (updated) => {
    const idx = productsData.findIndex(p => p.id === updated.id);
    if (idx === -1) return false;
    productsData[idx] = { ...productsData[idx], ...updated };
    return true;
  };

  const addProduct = (product) => {
    setProducts(prevProducts => [...prevProducts, product]);
  };

  return (
    <ProductsContext.Provider value={{ productsData, getCategories, getProductsByCategory, getProductById, getProductsGroupedByCategory, searchProducts, calculateDiscountedPrice, hasDiscount, updateProduct, addProduct }}>
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