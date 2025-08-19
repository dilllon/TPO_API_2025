import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCardAdded({ id, title, price, image, stock, onClick, onQuantityChange, qty = 1, variant = "default" }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${id}`);
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

  return (
    <div className={`product-card ${variant}`}>
      <div className="product-clickable-area" onClick={handleProductClick}>
        <img src={image} alt={title} className="product-image" />
        <div className="product-desc">
          <h3 className="product-title">{title}</h3>
          <p className="product-price">${price}</p>
          <p className="product-stock">
            Stock:{' '}
            {stock > 0 ? stock : <span className="out-of-stock">Sin stock</span>}
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
            max={stock}
            value={qty}
            onChange={(e) => handleQuantityChange(e, parseInt(e.target.value) || 1)}
            className="quantity-input"
          />
          <button 
            className="quantity-btn"
            onClick={(e) => handleQuantityChange(e, Math.min(stock, qty + 1))}
            disabled={qty >= stock}
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
