import './ProductCard.css';

function ProductCard({ titulo, precio, imagen, stock, onClick, variant = "default" }) {
  return (
    <div className={`producto-card ${variant}`}>
      <img src={imagen} alt={titulo} className="producto-imagen" />
      <h3 className="producto-titulo">{titulo}</h3>
      <p className="producto-precio">${precio}</p>
      <p className="producto-stock">
        Stock:{' '}
        {stock > 0 ? stock : <span className="sin-stock">Sin stock</span>}
      </p>
      <button onClick={onClick}>Agregar al carrito</button>
    </div>
  );
}

export default ProductCard;
