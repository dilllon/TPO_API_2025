import { FaEdit, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../../context/ProductContext';
import { useUser } from '../../../context/UserContext';
import { useFavorites } from '../../../hooks/useFavorite';
import { useState } from 'react';
import AuthAlert from '../AuthAlert/AuthAlert';
import './ProductCard.css';

function ProductCard({ product, onClick, variant = 'default' }) {
  const { calculateDiscountedPrice, hasDiscount, canEdit } = useProducts();
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useUser();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const onAddToCart = (e) => {
    e.stopPropagation(); // Evita que se active la navegación

    if (onClick) {
      onClick(product);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}/edit`);
  };

  const handleAddToFavorites = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    if (isFavorite) {
      // Si ya es favorito, quitarlo
      if (typeof removeFromFavorites === 'function') {
        removeFromFavorites(product.id);
      }
    } else {
      addToFavorites(product);
    }
  };

  const productHasDiscount = hasDiscount(product);
  const discountedPrice = calculateDiscountedPrice(product);

  return (
    <div className={`product-card ${variant}`}>
      {productHasDiscount && (
        <div className="discount-badge">-{product.discount}%</div>
      )}
      <div className="product-clickable-area" onClick={handleProductClick}>
        <div className="product-card-header">
          <h3 className="product-title">{product.title}</h3>
           <button
             onClick={handleAddToFavorites}
             className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
             aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
           >
             {isFavorite ? <FaHeart /> : <FaRegHeart />}
           </button>
        </div>
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
        <div className="price-container">
          {productHasDiscount ? (
            <>
              <p className="product-price original-price">${product.price}</p>
              <p className="product-price discounted-price">
                ${discountedPrice}
              </p>
            </>
          ) : (
            <p className="product-price">${product.price}</p>
          )}
        </div>
        <p className="product-stock">
          Stock:{' '}
          {product.stock > 0 ? (
            product.stock
          ) : (
            <span className="out-of-stock">Sin stock</span>
          )}
        </p>
      </div>
      <div className='product-btns'>
        {variant !== "editable" && <button onClick={onAddToCart}>Agregar al carrito</button>}
        {isAuthenticated && canEdit(product.id, userData.id) && <button onClick={handleEdit} className='edit-button'><FaEdit /></button>}
      </div>
    <AuthAlert
      isVisible={showAuthAlert}
      onClose={() => setShowAuthAlert(false)}
      message="Debes iniciar sesión para agregar productos a favoritos."
    />
    </div>
  );
}

export default ProductCard;
