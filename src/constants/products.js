
// Base de datos de productos (ahora vacía - los datos vienen de la API)
export const productsData = [];

// Función para obtener todas las categorías únicas
export const getCategories = () => {
  if (!productsData.length) return [];
  const uniqueCategories = [...new Set(productsData.map(product => product.category))];
  return uniqueCategories;
};

// Función para obtener solo los nombres de las categorías (alias para compatibilidad)
export const getCategoryNames = getCategories;

// Función para obtener productos por categoría
export const getProductsByCategory = (categoryName) => {
  if (!productsData.length) return [];
  return productsData.filter(product => product.category === categoryName);
};

// Función para obtener un producto por ID
export const getProductById = (id) => {
  if (!productsData.length) return null;
  return productsData.find(product => product.id === id);
};

// Función para obtener productos organizados por categorías (para el grid)
export const getProductsGroupedByCategory = () => {
  if (!productsData.length) return [];
  const categories = getCategories();
  return categories.map(categoryName => ({
    categoryName,
    products: getProductsByCategory(categoryName)
  }));
};

// Variable categories para compatibilidad con código existente
export const categories = getProductsGroupedByCategory();

// Función para buscar productos por título
export const searchProducts = (searchTerm) => {
  if (!productsData.length) return [];
  if (!searchTerm) return productsData;
  
  return productsData.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Función para calcular el precio con descuento
export const calculateDiscountedPrice = (product) => {
  if (!hasDiscount(product)) return product.price;
  return Math.round(product.price * (1 - product.discount / 100));
};

// Función para verificar si un producto tiene descuento
export const hasDiscount = (product) => {
  return product.discount && typeof product.discount === 'number' && product.discount > 0;
};

// Funcion para actualizar el producto en nuestro modelo de datos
export const updateProduct = (updated) => {
  if (!productsData.length) return false;
  const idx = productsData.findIndex(p => p.id === updated.id);
  if (idx === -1) return false;
  productsData[idx] = { ...productsData[idx], ...updated };
  return true;
};