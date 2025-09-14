import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import ProductsGrid from '../../organisms/Grid/Products';
import Header from '../../organisms/Header/Header';
import './Home.css';
import { toast } from 'react-toastify';
import AuthAlert from '../../molecules/AuthAlert/AuthAlert';

function Home() {
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, userData, isLoading } = useUser();
  const { addToCart } = useCart();

  // Verificar si los datos están cargando
  useEffect(() => {
    if (isLoading) {
      console.log('Cargando datos del usuario...');
    }
  }, [isLoading]);

  const handleAddToCart = (product) => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }

    // Usar la función del contexto
    addToCart(product, 1);

    // Opcional: mostrar mensaje de éxito
    toast.success(`'${product.title}' se ha agregado al carrito`, {
      position: "top-right",
      autoClose: 1500, // 2 segundos
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <Header />
      <main>
        <section>
          <div className="welcome-message">
            <h2>¡Bienvenido a nuestra tienda!</h2>
          </div>
          <p>
            Explorá nuestros productos y hacé tu compra de forma fácil y rápida.
          </p>
        </section>
        <ProductsGrid onAddToCart={handleAddToCart} />
      </main>

      <AuthAlert
        isVisible={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
        message="Necesitas iniciar sesión para agregar productos al carrito."
      />
    </>
  );
}

export default Home;
