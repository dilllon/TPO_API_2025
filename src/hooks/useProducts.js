import { useEffect, useState } from 'react';
import { productAPI } from '../services/api.js';

// Hook personalizado para manejar productos
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Función para buscar productos
  const searchProducts = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.search(query);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para filtrar por categoría
  const filterByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const data = category === 'all' 
        ? await productAPI.getAll()
        : await productAPI.getByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error filtering products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener productos de un vendedor específico
  const getProductsBySeller = async (sellerId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getBySeller(sellerId);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo producto
  const createProduct = async (productData) => {
    try {
      setError(null);
      const newProduct = await productAPI.create(productData);
      setProducts(prev => [...prev, newProduct]);
      return { success: true, product: newProduct };
    } catch (err) {
      setError(err.message);
      console.error('Error creating product:', err);
      return { success: false, error: err.message };
    }
  };

  // Función para actualizar un producto
  const updateProduct = async (id, productData) => {
    try {
      setError(null);
      const updatedProduct = await productAPI.update(id, productData);
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      return { success: true, product: updatedProduct };
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
      return { success: false, error: err.message };
    }
  };

  // Función para eliminar un producto
  const deleteProduct = async (id) => {
    try {
      setError(null);
      await productAPI.delete(id);
      setProducts(prev => prev.filter(product => product.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
      return { success: false, error: err.message };
    }
  };

  // Función para obtener un producto por ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Función para obtener productos con descuento
  const getDiscountedProducts = () => {
    return products.filter(product => product.discount && product.discount > 0);
  };

  // Función para obtener productos por precio
  const getProductsByPriceRange = (minPrice, maxPrice) => {
    return products.filter(product => {
      const price = product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return price >= minPrice && price <= maxPrice;
    });
  };

  // Función para obtener categorías únicas
  const getCategories = () => {
    const categories = [...new Set(products.map(product => product.category))];
    return categories.sort();
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    searchProducts,
    filterByCategory,
    getProductsBySeller,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getDiscountedProducts,
    getProductsByPriceRange,
    getCategories,
  };
};

// Hook para un producto específico
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  return { product, loading, error };
};

export default { useProducts, useProduct };
