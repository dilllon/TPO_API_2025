import './Home.css';
import Carrousel from '@/components/organisms/Carrousel/Carrousel';
import HeaderRegistrado from '@/components/organisms/Header/HeaderRegistrado';
import ProductosGrid from '@/components/organisms/Grid/Productos';
import { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";



function HomeRegistrado() {
  const [cantItems, setcantItems] = useState(0);
  const handleAddToCart = () => {
    setcantItems(cantItems + 1);
  }
  


  return (
    <>
      <HeaderRegistrado />
      {/* <Carrousel /> */}
      <main>
        <section>
          <div className='welcome-message'>
            <h2>¡Bienvenido  Nombre a nuestra tienda!</h2>
              <div className="cart-icon">
                <FaShoppingCart size={28} />
              <span className="cart-badge">{cantItems}</span>
            </div>
          </div>
          <p>
            Explorá nuestros productos y hacé tu compra de forma fácil y rápida.
          </p>
        </section>
        <ProductosGrid onClick={handleAddToCart} />
        {/* Aquí se pueden agregar más secciones o componentes */}

      </main>
    </>
  );
}

export default HomeRegistrado;
