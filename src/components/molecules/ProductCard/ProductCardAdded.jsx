import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';
import './ProductCard.css';

function ProductCardAdded({ product, onClick, onQuantityChange, qty = 1, variant = "cart" }) {
  const navigate = useNavigate();
  const { calculateDiscountedPrice, hasDiscount } = useProducts();

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Evita que se active la navegación
    if (onClick) {
      onClick();
    }
  };

  const handleQuantityChange = (e, newQty) => {
    e.stopPropagation(); // Evita que se active la navegación
    if (onQuantityChange) {
      onQuantityChange(newQty);
    }
  };

  const productHasDiscount = hasDiscount(product);
  const discountedPrice = calculateDiscountedPrice(product);
  const displayPrice = productHasDiscount ? discountedPrice : product.price;

  return (
    <div className={`product-card ${variant}`}>
      {productHasDiscount && (
        <div className="discount-badge">
          -{product.discount}%
        </div>
      )}
      <div className="product-clickable-area" onClick={handleProductClick}>
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="product-desc">
          <h3 className="product-title">{product.title}</h3>
          <div className="price-container">
            {productHasDiscount ? (
              <>
                <p className="product-price original-price">${product.price}</p>
                <p className="product-price discounted-price">${discountedPrice}</p>
              </>
            ) : (
              <p className="product-price">${product.price}</p>
            )}
          </div>
          <p className="product-stock">
            Stock:{' '}
            {product.stock > 0 ? product.stock : <span className="out-of-stock">Sin stock</span>}
          </p>
        </div>
      </div>
      <div className="cart-controls">
        <div className="quantity-control">
          <button 
            className="quantity-btn"
            onClick={(e) => handleQuantityChange(e, Math.max(1, qty - 1))}
            disabled={qty <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => handleQuantityChange(e, parseInt(e.target.value) || 1)}
            className="quantity-input"
          />
          <button 
            className="quantity-btn"
            onClick={(e) => handleQuantityChange(e, Math.min(product.stock, qty + 1))}
            disabled={qty >= product.stock}
          >
            +
          </button>
        </div>
        <button onClick={handleDeleteClick} className="delete-button">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default ProductCardAdded;
