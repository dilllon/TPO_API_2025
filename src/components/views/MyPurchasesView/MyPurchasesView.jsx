import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '../../organisms/Header/Header';

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
          setPurchases(data[0].purchases || []);
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
      <main style={{ padding: '20px' }}>
        <h2>Mis compras</h2>

        {purchases.length === 0 ? (
          <p>No tenés compras registradas.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {purchases.map((p) => (
              <li key={p.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                <strong>{p.title}</strong> <br />
                Cantidad: {p.qty} <br />
                Precio pagado: ${p.pricePaid.toFixed(2)} <br />
                {p.thumbnail && <img src={p.thumbnail} alt={p.title} width={80} />}
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
