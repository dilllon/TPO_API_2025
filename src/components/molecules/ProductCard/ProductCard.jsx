import './ProductCard.css';

function ProductCard({ titulo, precio, imagen, stock }) {
  return (
    <div className="producto-card">
      <img src={imagen} alt={titulo} className="producto-imagen" />
      <h3 className="producto-titulo">{titulo}</h3>
      <p className="producto-precio">${precio}</p>
      <p className="producto-stock">
        Stock:{' '}
        {stock > 0 ? stock : <span className="sin-stock">Sin stock</span>}
      </p>
    </div>
  );
}

export function ProductCardCart({ title, price, image, stock }) {
  return (
    <div className="product-cart-card">
      <img src={image} alt={title} className="product-cart-image" />
      <h3 className="product-cart-title">{title}</h3>
      <p className="product-cart-price">${price}</p>
      <p className="product-cart-stock">
        Stock:{' '}
        {stock > 0 ? stock : <span className="sin-stock">Sin stock</span>}
      </p>
    </div>
  );
}

export default ProductCard;
