import Header from '@/components/organisms/Header/Header';
import './Cart.css';

function Cart() {
  return (
  <>
    <Header/>
    <div className="cart-container">
      <div className="cart-message">
        <h2>Tu carrito de compras</h2>
        <p>Agrega productos a tu carrito</p>
      </div>
    </div>
  </>
  );
};

export default Cart;