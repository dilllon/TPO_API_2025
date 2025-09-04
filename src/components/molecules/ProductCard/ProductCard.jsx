import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { calculateDiscountedPrice, hasDiscount } from '../../../constants/products';
import { useAuth } from '../../../context/AuthContext';
import { productAPI } from '../../../services/api';
import AuthAlert from '../AuthAlert/AuthAlert';
import './ProductCard.css';

function ProductCard({ product, onClick, variant = "default", onProductDeleted }) {
  const navigate = useNavigate();
  const { isAuthenticated, canEditProduct, canDeleteProduct } = useAuth();
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const onAddToCart = (e) => {
    e.stopPropagation(); // Evita que se active la navegación
    
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    
    if (onClick) {
      onClick(product);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    
    // Determinar el identificador del vendedor (priorizar username)
    const sellerIdentifier = product.sellerUsername || product.sellerId;
    
    // Verificar permisos para editar
    if (!canEditProduct(sellerIdentifier)) {
      setShowAuthAlert(true);
      return;
    }
    
    navigate(`/products/${product.id}/edit`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    // Determinar el identificador del vendedor (priorizar username)
    const sellerIdentifier = product.sellerUsername || product.sellerId;
    
    // Verificar permisos para eliminar
    if (!canDeleteProduct(sellerIdentifier)) {
      setShowAuthAlert(true);
      return;
    }
    
    const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar "${product.title || product.name}"?`);
    if (confirmDelete) {
      setIsDeleting(true);
      try {
        await productAPI.delete(product.id);
        console.log('Producto eliminado exitosamente');
        
        // Notificar al componente padre si se proporciona callback
        if (onProductDeleted) {
          onProductDeleted(product.id);
        }
        
        // Opcional: recargar la página o actualizar la lista
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const productHasDiscount = hasDiscount(product);
  const discountedPrice = calculateDiscountedPrice(product);
  
  // Determinar el identificador del vendedor para los botones
  const sellerIdentifier = product.sellerUsername || product.sellerId;
  
  // Debug: Log para diagnosticar el problema
  console.log('ProductCard Debug:', {
    productId: product.id,
    productTitle: product.title,
    sellerId: product.sellerId,
    sellerUsername: product.sellerUsername,
    sellerIdentifier,
    isAuthenticated,
    canEdit: canEditProduct(sellerIdentifier),
    canDelete: canDeleteProduct(sellerIdentifier)
  });

  return (
    <>
      <div className={`product-card ${variant}`}>
        {productHasDiscount && (
          <div className="discount-badge">
            -{product.discount}%
          </div>
        )}
        <div className="product-clickable-area" onClick={handleProductClick}>
          <h3 className="product-title">{product.title || product.name}</h3>
          <img src={product.image} alt={product.title || product.name} className="product-image" />
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
          {console.log('Render buttons check:', {
            productId: product.id,
            isAuthenticated,
            canEditResult: canEditProduct(sellerIdentifier),
            canDeleteResult: canDeleteProduct(sellerIdentifier),
            sellerIdentifier
          })}
          {(isAuthenticated && canEditProduct(sellerIdentifier)) && (
            <button onClick={handleEdit} className='edit-button' title="Editar producto" style={{backgroundColor: '#f39c12', color: 'white'}}>
              <FaEdit />
            </button>
          )}
          {(isAuthenticated && canDeleteProduct(sellerIdentifier)) && (
            <button 
              onClick={handleDelete} 
              className='delete-button' 
              title="Eliminar producto"
              disabled={isDeleting}
              style={{backgroundColor: '#e74c3c', color: 'white'}}
            >
              <FaTrash />
            </button>
          )}
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

export default ProductCard;
