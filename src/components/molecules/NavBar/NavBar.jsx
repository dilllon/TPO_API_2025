import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
// import crearCuentaImg from '../../../assets/images/crearusuarioimg.jpg';
// import icono from '../../../assets/images/icono.jpg';
import { getCategoryNames } from '../../../constants/products';
import Logo from '../../atoms/Logo/Logo.jsx';
import Buscador from '../../atoms/Buscador/Buscador.jsx';
import Profile from '../../atoms/Profile/Profile.jsx';
import Dropdown from '../../atoms/Dropdown/Dropdown.jsx';
import InfoDropdown from '../../atoms/InfoDropdown/InfoDropdown';
import styles from './NavBar.module.css';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Cambiar de true a false dependiendo del NavBar que se quiere ver
  const isLoggedIn = true;

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

  // Datos de muestra para el perfil de usuario.
  const mockUser = {
    userName: 'Tomás Nakasone',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK7-GWRf4z46CrzTubYTvsFzLk1Ym2-lX7DA&s', // URL de Iron Man
  };

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
                <Link to="/">Inicio</Link>
              </li>
              <Dropdown title="Categorías" items={getCategoryNames()} />
              <li>
                <Link
                  to="/clients/previous-orders"
                  className={styles['nav-link-icon']}
                >
                  <span>Mis compras</span>
                </Link>
              </li>
            </ul>
            <ul className={styles['nav-list-right']}>
              <li>
                <InfoDropdown
                  title="Notificaciones"
                  items={mockNotifications}
                  icon="notif"
                />
              </li>
              <li>
                <InfoDropdown
                  title="Favoritos"
                  items={mockFavorites}
                  icon="fav"
                />
              </li>
              <li>
                <Link
                  to="/cart"
                  className={styles['nav-link-icon']}
                  title="Carrito"
                >
                  <FaShoppingCart />
                </Link>
              </li>
              <li className={styles['profile']}>
                {isLoggedIn ? (
                  <Profile
                    userName={mockUser.userName}
                    imageUrl={mockUser.imageUrl}
                  />
                ) : (
                  <div className={styles.authButtonsContainer}>
                    <Link to="/clients/login" className={styles.loginButton}>
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/clients/register"
                      className={styles.registerButton}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
