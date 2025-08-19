import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ id, title, price, image, stock, onClick, variant = "default" }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que se active la navegación
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`product-card ${variant}`}>
      <div className="product-clickable-area" onClick={handleProductClick}>
        <img src={image} alt={title} className="product-image" />
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${price}</p>
        <p className="product-stock">
          Stock:{' '}
          {stock > 0 ? stock : <span className="out-of-stock">Sin stock</span>}
        </p>
      </div>
      <button onClick={handleAddToCart}>Agregar al carrito</button>
    </div>
  );
}

export default ProductCard;
