import ProductosGrid from '@/components/organisms/Grid/Products';
import Header from '@/components/organisms/Header/Header';
import { useEffect } from 'react';
import './Home.css';

function Home() {
  // Asegurar que no hay token cuando estamos en modo no logueado
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  return (
    <>
      <Header />
      {/* <Carrousel /> */}
      <main>
        <section>
          <div className='welcome-message'>
            <h2>¡Bienvenido a nuestra tienda!</h2>
          </div>
          <p>
            Explorá nuestros productos y hacé tu compra de forma fácil y rápida.
          </p>
        </section>
        <ProductosGrid/>
      </main>
    </>
  );
}

export default Home;
