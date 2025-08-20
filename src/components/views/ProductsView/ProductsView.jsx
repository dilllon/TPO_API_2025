import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  calculateDiscountedPrice,
  getProductById,
  hasDiscount,
} from '../../../constants/products';
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

  useEffect(() => {
    // Simular carga de datos del producto
    setTimeout(() => {
      const foundProduct = getProductById(id);
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    // Lógica para agregar al carrito (similar a la del proyecto)
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');

    // Buscar si el producto ya existe en el carrito
    const existingIndex = cart.findIndex((item) => item.id === product.id);

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
        qty: quantity,
      });
    }

    // Guardar en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));

    // Disparar evento para notificar a otros componentes
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cartItems',
        newValue: JSON.stringify(cart),
      }),
    );

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
      <>
        {isLoggedIn ? <HeaderRegistrado /> : <Header />}
        <div className="products-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
            {hasDiscount(product) && (
              <div className="discount-badge-large">
                -{product.discount}% OFF
              </div>
            )}

            <div className="product-header">
              <span className="product-category">{product.category}</span>
              <span className="product-brand">{product.brand}</span>
            </div>

            <h1 className="product-title">{product.title}</h1>

            <div className="product-price-section">
              {hasDiscount(product) ? (
                <div className="price-with-discount">
                  <span className="original-price-large">${product.price}</span>
                  <span className="discounted-price-large">
                    ${calculateDiscountedPrice(product)}
                  </span>
                  <span className="savings">
                    Ahorrás ${product.price - calculateDiscountedPrice(product)}
                  </span>
                </div>
              ) : (
                <span className="product-price">${product.price}</span>
              )}
              <span className="product-stock">
                {product.stock > 0 ? (
                  <>
                    Stock disponible: <strong>{product.stock} unidades</strong>
                  </>
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
              <p>
                <strong>Garantía:</strong> {product.warranty}
              </p>
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

                <button onClick={handleAddToCart} className="add-to-cart-btn">
                  Agregar al carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductsView;
