import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../../../context/ProductContext';
import { useUser } from '../../../context/UserContext';
import { useFavorites } from '../../../hooks/useFavorite';
import { useCart } from '../../../context/CartContext';
import Header from '../../organisms/Header/Header';
import './ProductsView.css';
import AuthAlert from '../../molecules/AuthAlert/AuthAlert';
import { toast } from 'react-toastify';
import ConfirmModal from '../../atoms/ConfirmModal/ConfirmModal';

function ProductsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData: user, isAuthenticated } = useUser();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const { getProductById, calculateDiscountedPrice, hasDiscount, isLoading, error: contextError, canEdit, canDelete, deleteProduct } = useProducts();
  const { addToCart } = useCart();

  console.log('ProductsView - isAuthenticated:', isAuthenticated, 'user:', user);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isFavorite = product
    ? favorites.some(
        (fav) => (fav?.productId ?? fav?.product?.id ?? fav?.id) === product.id
      )
    : false;

  // Debug para verificar el estado de showAuthAlert
  useEffect(() => {
    console.log('showAuthAlert cambió a:', showAuthAlert);
  }, [showAuthAlert]);

  // Obtener el producto cuando el componente se monta o cambia el ID
  useEffect(() => {
    if (id && !isLoading) {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setError(null);
      } else {
        setError('Producto no encontrado');
      }
      setLoading(false);
    }
  }, [id, getProductById, isLoading]);

  useEffect(() => {
    // Reset selected image when product changes
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  const handleAddToCart = () => {
    console.log('handleAddToCart ejecutado, isAuthenticated:', isAuthenticated);

    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, mostrando alerta');
      setShowAuthAlert(true);
      return;
    }

    // Usar la función del contexto
    addToCart(product, quantity);
    toast.success(`Se agregaron ${quantity} unidades de "${product.title}" al carrito`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleEdit = () => {
    if (!canEdit(product.id, user.id)) {
      setShowAuthAlert(true);
      return;
    }

    navigate(`/products/${product.id}/edit`);
  };

  const handleAddToFavorites = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    if (isFavorite) {
      if (typeof removeFromFavorites === 'function') {
        removeFromFavorites(product.id);
      }
    } else {
      addToFavorites(product);
    }
  };

  const handleDelete = () => {
    if (!canDelete(product.id, user.id)) {
      setShowAuthAlert(true);
      return;
    }

    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
    
    try {
      const success = await deleteProduct(product.id);
      
      if (success) {
        console.log('Producto eliminado exitosamente');
        toast.success('¡Producto eliminado exitosamente!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Redirigir después de mostrar la notificación
        navigate('/products/my-products');
      } else {
        throw new Error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      toast.error('Error al eliminar el producto. Por favor, intenta de nuevo.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };  const handleQuantityChange = (e) => {
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

            <div className="product-title-container">
              <h1 className="product-title">{product.title}</h1>
              <button
                onClick={handleAddToFavorites}
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>


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

                <div className="product-stock-section">
                  <span className="product-stock">
                    Stock disponible: <strong>{product.stock} unidades</strong>
                  </span>
                </div>

                <button
                  onClick={() => {
                    console.log('Botón clickeado');
                    handleAddToCart();
                  }}
                  className="add-to-cart-btn"
                >
                  Agregar al carrito
                </button>
              </div>
            )}

            {product.stock === 0 && (
              <div className="product-stock-section">
                <span className="product-stock">
                  <span className="out-of-stock">Sin stock</span>
                </span>
              </div>
            )}

            {product.sellerUsername && (
              <div className="seller-info">
                <span className="seller-tag">Publicado por: {product.sellerUsername}</span>
              </div>
            )}

            {/* Botones de editar y eliminar */}
            {isAuthenticated && (canEdit(product.id, user?.id) || canDelete(product.id, user?.id)) && (
              <div className="product-actions">
                {canEdit(product.id, user?.id) && (
                  <button onClick={handleEdit} className="edit-button" title="Editar producto">
                    <FaEdit />
                  </button>
                )}
                {canDelete(product.id, user?.id) && (
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

      <AuthAlert
        isVisible={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
        message="Debes iniciar sesión para ver agregar items al carrito"
      />

      <ConfirmModal
        isVisible={showDeleteModal}
        title="Eliminar producto"
        message={`¿Estás seguro de que quieres eliminar "${product?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </>
  );
}

export default ProductsView;
