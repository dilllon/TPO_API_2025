import './Home.css';
import ProductoCard from '@/components/molecules/ProductCard/ProductCard';
import Carrousel from '@/components/organisms/Carrousel/Carrousel';
import Header from '@/components/organisms/Header/Header';

function Home() {
  return (
    <>
      <Header />
      <Carrousel />
      <main>
        <h2>¡Bienvenido a nuestra tienda!</h2>
        <p>
          Explorá nuestros productos y hacé tu compra de forma fácil y rápida.
        </p>

        <div className="productos-grid">
          <ProductoCard
            titulo="Mouse inalámbrico"
            precio={2999}
            imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
            stock={0}
          />
          {/* Puedes agregar más productos aquí */}
        </div>
      </main>
    </>
  );
}

export default Home;
