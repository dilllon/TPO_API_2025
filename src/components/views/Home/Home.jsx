import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import ProductsGrid from '../../organisms/Grid/Products';
import Header from '../../organisms/Header/Header';
import './Home.css';
import { SearchProvider } from "../../../context/SearchContext";

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
    alert(`${product.title} agregado al carrito`);
  };

  return (
    <>
      <SearchProvider>
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

        {showAuthAlert && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3>¡Inicia sesión!</h3>
              <p>Necesitas iniciar sesión para agregar productos al carrito</p>
              <button onClick={() => setShowAuthAlert(false)} style={{ marginRight: '10px' }}>Cerrar</button>
              <button onClick={() => { setShowAuthAlert(false); navigate('/clients/login'); }}>Iniciar Sesión</button>
            </div>
          </div>
        )}
      </SearchProvider>
    </>
  );
}

export default Home;
