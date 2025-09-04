import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import {
  calculateDiscountedPrice,
  hasDiscount,
} from '../../../constants/products';
import { useAuth } from '../../../context/AuthContext';
import { useProduct } from '../../../hooks/useProducts';
import { productAPI } from '../../../services/api';
import AuthAlert from '../../molecules/AuthAlert/AuthAlert';
import Header from '../../organisms/Header/Header';
import './ProductsView.css';

function ProductsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, canEditProduct, canDeleteProduct } = useAuth();
  const { product, loading, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Reset selected image when product changes
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  const handleAddToCart = () => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }

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

  const handleEdit = () => {
    if (!canEditProduct(product.sellerId)) {
      setShowAuthAlert(true);
      return;
    }
    
    navigate(`/products/${product.id}/edit`);
  };

  const handleDelete = async () => {
    if (!canDeleteProduct(product.sellerId)) {
      setShowAuthAlert(true);
      return;
    }

    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar "${product.title}"?`);
    if (confirmDelete) {
      setIsDeleting(true);
      try {
        await productAPI.delete(product.id);
        console.log('Producto eliminado exitosamente');
        alert('Producto eliminado exitosamente');
        navigate('/'); // Redirigir al home después de eliminar
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
      } finally {
        setIsDeleting(false);
      }
    }
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
        <Header />
        <div className="products-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
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
      <Header />
      <div className="products-container">
        <button onClick={handleGoBack} className="back-button">
          ← Volver atrás
        </button>

        <div className="product-detail-card">
          <div className="product-images-section">
            <div className="main-image-container">
              <img
                src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image}
                alt={product.title}
                className="main-product-image"
              />
            </div>

            {product.images && product.images.length > 1 && (
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
              {product.category && <span className="product-category">{product.category}</span>}
              {product.brand && <span className="product-brand">{product.brand}</span>}
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
                <span className="product-price-medium">${product.price}</span>
              )}
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

            {product.sellerUsername && (
              <div className="seller-info">
                <span className="seller-tag">Publicado por: {product.sellerUsername}</span>
              </div>
            )}

            <div className="product-stock-section">
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

            {/* Botones de editar y eliminar */}
            {isAuthenticated && (canEditProduct(product.sellerId) || canDeleteProduct(product.sellerId)) && (
              <div className="product-actions">
                {canEditProduct(product.sellerId) && (
                  <button onClick={handleEdit} className="edit-button" title="Editar producto">
                    <FaEdit />
                  </button>
                )}
                {canDeleteProduct(product.sellerId) && (
                  <button 
                    onClick={handleDelete} 
                    className="delete-button" 
                    title="Eliminar producto"
                    disabled={isDeleting}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}

            {product.description && (
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Características principales</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.warranty && (
              <div className="product-warranty">
                <p>
                  <strong>Garantía:</strong> {product.warranty}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAuthAlert && (
        <AuthAlert 
          onClose={() => setShowAuthAlert(false)}
          message="Necesitas iniciar sesión para realizar esta acción"
        />
      )}
    </>
  );
}

export default ProductsView;
