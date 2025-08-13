import Header from '@/components/organisms/Header/Header';
import icono from '@/assets/images/cart/cart-icon.png';
import './Cart.css';

function Cart() {
  return (
  <>
    <Header/>
    <div className="cart-container">
      <div className="cart-message">
        <h2>Tu carrito de compras</h2>
        <p>Agrega productos a tu carrito</p>
        <img src={icono} alt="cart-img" />
      </div>
    </div>
  </>
  );
};

export default Cart;

