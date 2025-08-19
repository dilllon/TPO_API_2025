import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../organisms/Header/Header';
import HeaderRegistrado from '../../organisms/Header/HeaderRegistrado';
import './ProductsView.css';

function ProductsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Simulamos si el usuario está logueado (puedes usar tu store/context aquí)
  const isLoggedIn = localStorage.getItem('token') !== null;

  // Datos de ejemplo de productos (reemplazar con tu API/store)
  const productsData = [
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
      image: "/src/assets/images/carrousel/foto2.jpg",
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
      image: "/src/assets/images/carrousel/foto1.png",
      images: [
        "/src/assets/images/carrousel/foto1.png",
        "/src/assets/images/carrousel/foto2.jpg"
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
      image: "/src/assets/images/carrousel/foto2.jpg",
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
      image: "/src/assets/images/carrousel/foto1.png",
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

  useEffect(() => {
    // Simular carga de datos del producto
    setTimeout(() => {
      const foundProduct = productsData.find(p => p.id === id);
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    // Lógica para agregar al carrito (similar a la del proyecto)
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Buscar si el producto ya existe en el carrito
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Si existe, aumentar la cantidad
      cart[existingIndex].qty = (cart[existingIndex].qty || 1) + quantity;
    } else {
      // Si no existe, agregarlo nuevo
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        stock: product.stock,
        qty: quantity
      });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Disparar evento para notificar a otros componentes
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'cartItems',
      newValue: JSON.stringify(cart)
    }));
    
    alert(`Se agregaron ${quantity} unidades de "${product.title}" al carrito`);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="app-gradient">
        {isLoggedIn ? <HeaderRegistrado /> : <Header />}
        <div className="products-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-gradient">
        {isLoggedIn ? <HeaderRegistrado /> : <Header />}
        <div className="products-container">
          <div className="error-message">
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o ha sido eliminado.</p>
            <button onClick={handleGoBack} className="back-button">
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-gradient">
      {isLoggedIn ? <HeaderRegistrado /> : <Header />}
      
      <div className="products-container">
        <button onClick={handleGoBack} className="back-button">
          ← Volver atrás
        </button>

        <div className="product-detail-card">
          <div className="product-images-section">
            <div className="main-image-container">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title}
                className="main-product-image"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="thumbnail-images">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.title} - Vista ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <span className="product-category">{product.category}</span>
              <span className="product-brand">{product.brand}</span>
            </div>
            
            <h1 className="product-title">{product.title}</h1>
            
            <div className="product-price-section">
              <span className="product-price">${product.price}</span>
              <span className="product-stock">
                {product.stock > 0 ? (
                  <>Stock disponible: <strong>{product.stock} unidades</strong></>
                ) : (
                  <span className="out-of-stock">Sin stock</span>
                )}
              </span>
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-features">
              <h3>Características principales</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="product-warranty">
              <p><strong>Garantía:</strong> {product.warranty}</p>
            </div>

            {product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Cantidad:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="add-to-cart-btn"
                >
                  Agregar al carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
