import ProductosGrid from '@/components/organisms/Grid/Products';
import Header from '@/components/organisms/Header/Header';
import './Home.css';

function Home() {

   const onAddToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    

    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
    existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
    cartItems.push({ ...product, qty: 1 });
  }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  return (
    <>
      <Header />
      {/* <Carrousel /> */}
      <main>
        <section>
          <div className="welcome-message">
            <h2>¡Bienvenido a nuestra tienda!</h2>
          </div>
          <p>
            Explorá nuestros productos y hacé tu compra de forma fácil y rápida.
          </p>
        </section>
        <ProductosGrid onAddToCart={onAddToCart} />
      </main>
    </>
  );
}

export default Home;
