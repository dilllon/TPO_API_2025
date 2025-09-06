import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import ProductsGrid from '../../organisms/Grid/Products';
import Header from '../../organisms/Header/Header';
import './Home.css';

function Home() {
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const handleAddToCart = (product) => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      setShowAuthAlert(true);
      return;
    }
    
    // Lógica para agregar al carrito
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
      cartItems.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Opcional: mostrar mensaje de éxito
    alert(`${product.title} agregado al carrito`);
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
    </>
  );
}

export default Home;
