import './Home.css';
import Carrousel from '@/components/organisms/Carrousel/Carrousel';
import Header from '@/components/organisms/Header/Header';
import ProductosGrid from '@/components/organisms/Grid/Productos';

function Home() {
  return (
    <>
      <Header />
      {/* <Carrousel /> */}
      <main>
        <section className='d-flex flex-column justify-content-center align-items-center'>
          <h2>¡Bienvenido a nuestra tienda!</h2>
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
