import ProductsGrid from '@/components/organisms/Grid/Products';
import Header from '@/components/organisms/Header/Header';
import './Home.css';
import { ProductsProvider } from '@/context/ProductContext';

function Home() {

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
        <ProductsProvider>
          <ProductsGrid />
        </ProductsProvider>
      </main>
    </>
  );
}

export default Home;
