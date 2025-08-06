import './Product.css';

function ProductoCard({ titulo, precio, imagen, stock }) {
  return (
    <div className="producto-card">
      <img src={imagen} alt={titulo} className="producto-imagen" />
      <h3 className="producto-titulo">{titulo}</h3>
      <p className="producto-precio">${precio}</p>
      <p className="producto-stock">
        Stock: {stock > 0 ? stock : <span className="sin-stock">Sin stock</span>}
      </p>
    </div>
  );
}

export default ProductoCard;
