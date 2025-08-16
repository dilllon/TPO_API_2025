import './Home.css';
import Carrousel from '@/components/organisms/Carrousel/Carrousel';
import HeaderRegistrado from '@/components/organisms/Header/HeaderRegistrado';
import ProductosGrid from '@/components/organisms/Grid/Productos';

function HomeRegistrado() {
  return (
    <>
      <HeaderRegistrado />
      {/* <Carrousel /> */}
      <main>
        <section>
          <h2>¡Bienvenido  Nombre a nuestra tienda!</h2>
          <p>
            Explorá nuestros productos y hacé tu compra de forma fácil y rápida.
          </p>
        </section>
        <ProductosGrid/>
      </main>
    </>
  );
}

export default HomeRegistrado;
