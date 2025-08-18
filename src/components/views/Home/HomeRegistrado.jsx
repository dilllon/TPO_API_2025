import './Home.css';
import HeaderRegistrado from '@/components/organisms/Header/HeaderRegistrado';
import ProductosGrid from '@/components/organisms/Grid/Products';
import { useState } from 'react';

function HomeRegistrado() {
  // lee lo que haya guardado
  const [cantItems, setCantItems] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      return cart.reduce((total, item) => total + (item.qty || 1), 0);
    } catch {
      return 0;
    }
  });

const handleAddToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
  const i = cart.findIndex(it => it.id === product.id);

  if (i >= 0) {
    cart[i].qty = (cart[i].qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem('cartItems', JSON.stringify(cart));
  setCantItems(cart.reduce((a, it) => a + (it.qty || 1), 0)); // badge correcto
  
  // Disparar evento personalizado para notificar al navbar
  window.dispatchEvent(new Event('cartUpdated'));
};


  return (
    <>
      <HeaderRegistrado />
      <main>
        <section>
          <div className='welcome-message'>
            <h2>¡Bienvenido Nombre a nuestra tienda!</h2>
          </div>
          <p>Explorá nuestros productos y hacé tu compra de forma fácil y rápida.</p>
        </section>

        {/* le paso la función tal cual; el Grid le enviará el producto */}
        <ProductosGrid onClick={handleAddToCart} />
      </main>
    </>
  );
}

export default HomeRegistrado;
