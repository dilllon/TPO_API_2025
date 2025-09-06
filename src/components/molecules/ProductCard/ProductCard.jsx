import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../../context/ProductContext';
import { useUser } from '../../../context/UserContext';
import './ProductCard.css';

function ProductCard({ product, onClick, variant = "default" }) {
  const { calculateDiscountedPrice, hasDiscount, canEdit } = useProducts();
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useUser();

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
  }

  const productHasDiscount = hasDiscount(product);
  const discountedPrice = calculateDiscountedPrice(product);

  return (
    <div className={`product-card ${variant}`}>
      {productHasDiscount && (
        <div className="discount-badge">
          -{product.discount}%
        </div>
      )}
      <div className="product-clickable-area" onClick={handleProductClick}>
        <h3 className="product-title">{product.title}</h3>
        <img src={product.image} alt={product.title} className="product-image" />
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
      <div className='product-btns'>
        <button onClick={onAddToCart}>Agregar al carrito</button>
        {isAuthenticated && canEdit(product.id, userData.id) && <button onClick={handleEdit} className='edit-button'><FaEdit /></button>}
      </div>
    </div>
  );
}

export default ProductCard;
