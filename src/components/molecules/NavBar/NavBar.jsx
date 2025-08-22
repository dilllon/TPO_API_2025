import { useState } from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
// import crearCuentaImg from '../../../assets/images/crearusuarioimg.jpg';
// import icono from '../../../assets/images/icono.jpg';
import { getCategoryNames } from '../../../constants/products';
import Logo from '../../atoms/Logo/Logo.jsx';
import Buscador from '../../atoms/Buscador/Buscador.jsx';
import Dropdown from '../../atoms/Dropdown/Dropdown.jsx';
import InfoDropdown from '../../atoms/InfoDropdown/InfoDropdown';
import styles from './NavBar.module.css';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Datos de muestra para las notificaciones. En una app real, vendrían de un estado global o una API.
  const mockNotifications = [
    {
      id: 1,
      message: 'Tu pedido #1234 ha sido enviado y llegará pronto.',
      timestamp: 'Hoy, 10:30 AM',
    },
    {
      id: 2,
      message:
        '¡Oferta especial! 20% de descuento en electrónicos hasta agotar stock.',
      timestamp: 'Ayer, 08:15 PM',
    },
    {
      id: 3,
      message:
        'Hemos procesado la devolución de tu producto. El reembolso se hará efectivo en 48hs.',
      timestamp: '25/05, 11:00 AM',
    },
    {
      id: 4,
      message:
        '¡Bienvenido a AmaZone! Completa tu perfil para una mejor experiencia.',
      timestamp: '24/05, 09:00 AM',
    },
  ];

  // Datos de muestra para los favoritos.
  const mockFavorites = [
    {
      id: 1,
      message: 'Smart TV 55" 4K UHD ahora en tus favoritos.',
      timestamp: 'Hoy, 11:00 AM',
      displayImage: 'https://picsum.photos/seed/tv/50',
    },
    {
      id: 2,
      message: 'Auriculares Inalámbricos con Cancelación de Ruido guardados.',
      timestamp: 'Ayer, 09:30 PM',
      displayImage: 'https://picsum.photos/seed/audio/50',
    },
    {
      id: 3,
      message: 'Zapatillas de Running - Talle 42 agregadas a favoritos.',
      timestamp: '24/05, 01:15 PM',
      displayImage: 'https://picsum.photos/seed/shoes/50',
    },
  ];

  // Lógica para construir los items de las categorías
  const isLoggedIn =
    typeof window !== 'undefined' &&
    localStorage.getItem('isLoggedIn') === 'true';
  const base = isLoggedIn ? '/r' : '/';

  const categoryNames = getCategoryNames();
  const categoryItems = categoryNames.map((name) => ({
    label: name,
    href: `${base}#category-${name.toLowerCase()}`,
  }));

  return (
    <nav className={styles['navbar']}>
      <div className={styles['izquierda']}>
        <Logo />
      </div>
      <div className={styles['centro']}>
        <div className={styles['primer-renglon']}>
          <Buscador />

          {/* Botón hamburguesa */}
          <button
            className={styles['burger']}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        <div className={styles['segundo-renglon']}>
          {/* Menú */}
          <div
            className={`${styles['nav-menu']} ${menuOpen ? styles['show'] : ''}`}
          >
            <ul className={styles['nav-list']}>
              <li>
                <a href="/">Inicio</a>
              </li>
              <Dropdown title="Categorías" items={categoryItems} />
              <li>
                <a
                  href="/clients/previous-orders"
                  className={styles['nav-link-icon']}
                >
                  <span>Mis compras</span>
                </a>
              </li>
            </ul>
            <ul className={styles['nav-list-right']}>
              <li className={styles['profile']}>
                {/* Insertar elemento de profile */}
              </li>
              <li>
                <InfoDropdown
                  title="Favoritos"
                  items={mockFavorites}
                  icon="fav"
                />
              </li>
              <li>
                <a
                  href="clients/cart"
                  className={styles['nav-link-icon']}
                  title="Carrito"
                >
                  <FaShoppingCart />
                </a>
              </li>
              <li>
                <InfoDropdown
                  title="Notificaciones"
                  items={mockNotifications}
                  icon="notif"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
