import './ProductCard.css';
import { FaTrash } from 'react-icons/fa';

function ProductCardAdded({ title, price, image, stock, onClick, onQuantityChange, qty = 1, variant = "default" }) {
  return (
    <div className={`product-card ${variant}`}>
      <img src={image} alt={title} className="product-image" />
      <div className="product-desc">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${price}</p>
        <p className="product-stock">
          Stock:{' '}
          {stock > 0 ? stock : <span className="out-of-stock">Sin stock</span>}
        </p>
        <div className="quantity-control">
          <button 
            className="quantity-btn"
            onClick={() => onQuantityChange(Math.max(1, qty - 1))}
            disabled={qty <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={qty}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            className="quantity-input"
          />
          <button 
            className="quantity-btn"
            onClick={() => onQuantityChange(Math.min(stock, qty + 1))}
            disabled={qty >= stock}
          >
            +
          </button>
        </div>
      </div>
      <button onClick={onClick} className="delete-button">
        <FaTrash />
      </button>
    </div>
  );
}

export default ProductCardAdded;
