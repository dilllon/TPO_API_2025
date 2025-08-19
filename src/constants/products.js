// Base de datos de productos centralizada
export const productsData = [
  {
    id: "cat1-0",
    title: "Mouse inalámbrico",
    price: 2999,
    image: "/src/assets/images/productos/52898-producto-logitech-g305-negro.jpg",
    images: [
      "/src/assets/images/productos/52898-producto-logitech-g305-negro.jpg",
      "/src/assets/images/productos/52898-producto-logitech-g305-negro.jpg"
    ],
    stock: 10,
    description: "Mouse inalámbrico de alta precisión con tecnología óptica avanzada. Ideal para gaming y uso profesional. Cuenta con una batería de larga duración y conectividad estable.",
    features: [
      "Sensor óptico de alta precisión",
      "Conectividad inalámbrica 2.4GHz",
      "Batería de larga duración (hasta 12 meses)",
      "Diseño ergonómico",
      "Compatible con Windows y Mac",
      "3 botones programables"
    ],
    category: "Electro",
    brand: "TechPro",
    warranty: "1 año"
  },
  {
    id: "cat1-1",
    title: "Teclado mecánico",
    price: 19999,
    discount: 10, // 10% de descuento
    image: "/src/assets/images/productos/teclado.jpeg",
    images: [
      "/src/assets/images/carrousel/foto2.jpg",
      "/src/assets/images/carrousel/foto1.png"
    ],
    stock: 10,
    description: "Teclado mecánico profesional con switches Cherry MX y retroiluminación RGB personalizable. Perfecto para gaming y programación con respuesta táctil superior.",
    features: [
      "Switches Cherry MX Blue",
      "Retroiluminación RGB personalizable",
      "Marco de aluminio resistente",
      "Teclas anti-ghosting",
      "Cable USB-C desmontable",
      "Software de personalización incluido"
    ],
    category: "Electro",
    brand: "GameMaster",
    warranty: "2 años"
  },
  {
    id: "cat1-2",
    title: "Monitor 24 pulgadas",
    price: 159999,
    image: "/src/assets/images/productos/pantalla.webp",
    images: [
      "/src/assets/images/productos/pantalla.webp",
      "/src/assets/images/productos/pantalla.webp"
    ],
    stock: 10,
    description: "Monitor LED de 24 pulgadas con resolución Full HD y frecuencia de actualización de 144Hz. Ideal para gaming y trabajo profesional con colores vibrantes y nitidez excepcional.",
    features: [
      "Pantalla LED IPS de 24\"",
      "Resolución Full HD 1920x1080",
      "Frecuencia de 144Hz",
      "Tiempo de respuesta 1ms",
      "Conectividad HDMI y DisplayPort",
      "Soporte ajustable en altura"
    ],
    category: "Electro",
    brand: "ViewTech",
    warranty: "3 años"
  },
  {
    id: "cat1-3",
    title: "Laptop gamer",
    price: 899999,
    image: "/src/assets/images/productos/laptop.webp",
    images: [
      "/src/assets/images/carrousel/foto2.jpg",
      "/src/assets/images/carrousel/foto1.png"
    ],
    stock: 10,
    description: "Potente laptop gaming diseñada para los gamers más exigentes. Equipada con procesador de última generación y tarjeta gráfica dedicada para una experiencia de juego excepcional.",
    features: [
      "Procesador Intel Core i7-12700H",
      "Tarjeta gráfica RTX 3060 6GB",
      "16GB RAM DDR4 expandible",
      "SSD NVMe de 512GB",
      "Pantalla 15.6\" 144Hz Full HD",
      "Teclado RGB mecánico"
    ],
    category: "Electro",
    brand: "GamerPro",
    warranty: "2 años"
  },
  {
    id: "cat1-4",
    title: "Smartphone 5G",
    price: 499999,
    image: "/src/assets/images/productos/smartphone.png",
    images: [
      "/src/assets/images/carrousel/foto1.png",
      "/src/assets/images/carrousel/foto2.jpg"
    ],
    stock: 10,
    description: "Smartphone de última generación con conectividad 5G, sistema de cámaras profesional y batería de larga duración. Perfecto para mantenerte conectado y capturar momentos increíbles.",
    features: [
      "Conectividad 5G ultra rápida",
      "Pantalla AMOLED de 6.5\"",
      "Sistema de triple cámara 108MP",
      "Batería de 5000mAh",
      "8GB RAM + 256GB almacenamiento",
      "Resistente al agua IP68"
    ],
    category: "Electro",
    brand: "MobileTech",
    warranty: "2 años"
  },
  {
    id: "cat2-0",
    title: "Cargador portátil",
    price: 9999,
    image: "/src/assets/images/carrousel/foto2.jpg",
    images: [
      "/src/assets/images/carrousel/foto2.jpg",
      "/src/assets/images/carrousel/foto1.png"
    ],
    stock: 10,
    description: "Cargador portátil de alta capacidad para mantener tus dispositivos siempre cargados. Compacto y ligero, ideal para viajes y uso diario.",
    features: [
      "Capacidad de 20,000mAh",
      "Carga rápida 18W",
      "Múltiples puertos USB",
      "Pantalla LED indicadora",
      "Protección contra sobrecarga",
      "Compatible con todos los dispositivos"
    ],
    category: "Cocina",
    brand: "PowerBank Pro",
    warranty: "1 año"
  },
  {
    id: "cat2-1",
    title: "Smartwatch",
    price: 79999,
    discount: 15, // 15% de descuento
    image: "/src/assets/images/carrousel/foto1.png",
    images: [
      "/src/assets/images/carrousel/foto1.png",
      "/src/assets/images/carrousel/foto2.jpg"
    ],
    stock: 10,
    description: "Smartwatch avanzado con monitoreo de salud, GPS integrado y resistencia al agua. Tu compañero perfecto para un estilo de vida activo y conectado.",
    features: [
      "Pantalla AMOLED de 1.4\"",
      "GPS integrado",
      "Monitor de frecuencia cardíaca",
      "Resistente al agua 5ATM",
      "Batería de 7 días",
      "Más de 100 modos deportivos"
    ],
    category: "Cocina",
    brand: "SmartLife",
    warranty: "2 años"
  },
  {
    id: "cat2-2",
    title: "Auriculares Bluetooth",
    price: 24999,
    image: "/src/assets/images/carrousel/foto2.jpg",
    images: [
      "/src/assets/images/carrousel/foto2.jpg",
      "/src/assets/images/carrousel/foto1.png"
    ],
    stock: 10,
    description: "Auriculares inalámbricos con cancelación de ruido activa y sonido de alta fidelidad. Perfectos para música, llamadas y entretenimiento.",
    features: [
      "Cancelación de ruido activa",
      "Sonido Hi-Fi con graves profundos",
      "Batería de 30 horas",
      "Conexión Bluetooth 5.0",
      "Micrófono integrado",
      "Estuche de carga incluido"
    ],
    category: "Cocina",
    brand: "AudioMax",
    warranty: "1 año"
  },
  {
    id: "cat2-3",
    title: "Tablet Android",
    price: 199999,
    image: "/src/assets/images/carrousel/foto1.png",
    images: [
      "/src/assets/images/carrousel/foto1.png",
      "/src/assets/images/carrousel/foto2.jpg"
    ],
    stock: 10,
    description: "Tablet Android de 10 pulgadas con procesador potente y pantalla de alta resolución. Ideal para productividad, entretenimiento y creatividad.",
    features: [
      "Pantalla IPS de 10.1\" 2K",
      "Procesador Octa-core",
      "4GB RAM + 128GB almacenamiento",
      "Cámaras frontal y trasera",
      "Batería de 8000mAh",
      "Soporte para stylus"
    ],
    category: "Cocina",
    brand: "TabletPro",
    warranty: "2 años"
  }
];

// Función para obtener todas las categorías únicas
export const getCategories = () => {
  const uniqueCategories = [...new Set(productsData.map(product => product.category))];
  return uniqueCategories;
};

// Función para obtener solo los nombres de las categorías (alias para compatibilidad)
export const getCategoryNames = getCategories;

// Función para obtener productos por categoría
export const getProductsByCategory = (categoryName) => {
  return productsData.filter(product => product.category === categoryName);
};

// Función para obtener un producto por ID
export const getProductById = (id) => {
  return productsData.find(product => product.id === id);
};

// Función para obtener productos organizados por categorías (para el grid)
export const getProductsGroupedByCategory = () => {
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
  if (!product.discount) return product.price;
  return Math.round(product.price * (1 - product.discount / 100));
};

// Función para verificar si un producto tiene descuento
export const hasDiscount = (product) => {
  return product.discount && product.discount > 0;
};
