import './ProductCard.css';

function ProductCard({ title, price, image, stock, onClick, variant = "default" }) {
  return (
    <div className={`product-card ${variant}`}>
      <img src={image} alt={title} className="product-image" />
      <h3 className="product-title">{title}</h3>
      <p className="product-price">${price}</p>
      <p className="product-stock">
        Stock:{' '}
        {stock > 0 ? stock : <span className="out-of-stock">Sin stock</span>}
      </p>
      <button onClick={onClick}>Agregar al carrito</button>
    </div>
  );
}

export default ProductCard;
