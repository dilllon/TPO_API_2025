import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '../../organisms/Header/Header';
import  './MyPurchasesView.css';

function MyPurchases() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userData } = useUser();
  const [purchases, setPurchases] = useState([]);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  // Fetch a json-server
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPurchases = async () => {
    try {
      const res = await fetch(`http://localhost:9000/purchases?userId=${userData.id}`);
      const data = await res.json();

      if (data.length > 0) {
        // juntar todos los arrays de purchases
        const allPurchases = data.flatMap(p => p.purchases || []);
        setPurchases(allPurchases);
      } else {
        setPurchases([]);
      }
    } catch (err) {
      console.error('Error al traer compras:', err);
      setPurchases([]);
    }
    };

    fetchPurchases();
  }, [isAuthenticated, userData]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthAlert(true);
    }
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <Header />
      <main className="mypurchases-container">
        <h2>Mis compras</h2>
        {purchases.length === 0 ? (
            <div className="mypurchases-empty">No tenés compras registradas.</div>
        ) : (
            <ul className="mypurchases-list">
            {purchases.map((p) => (
                <li key={p.productId} className="mypurchases-item">
                <div className="mypurchases-thumb">
                    <img src={p.thumbnail} alt={p.title} />
                </div>
                <div className="mypurchases-info">
                    <h3>{p.title}</h3>
                    <p>Cantidad: {p.qty}</p>
                    <p>Precio pagado: ${p.pricePaid.toFixed(2)}</p>
                </div>
                </li>
            ))}
            </ul>
        )}
        </main>

      {showAuthAlert && (
        <div style={{ background: 'rgba(0,0,0,0.7)', position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
            <h3>¡Inicia sesión!</h3>
            <p>Necesitás iniciar sesión para ver tus compras.</p>
            <button onClick={() => navigate('/clients/login')}>Iniciar sesión</button>
          </div>
        </div>
      )}
    </>
  );
}

export default MyPurchases;
