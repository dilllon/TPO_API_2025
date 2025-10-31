import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import crearCuentaImg from '../../../assets/images/crearusuarioimg.jpg';
// import icono from '../../../assets/images/icono.jpg';
// import { getCategoryNames } from '../../../constants/products';
import { useProducts } from '@/context/ProductContext';
import { useUser } from '@/context/UserContext';
import { useFavorites } from '@/hooks/useFavorite';
import Buscador from '../../atoms/Buscador/Buscador.jsx';
import Dropdown from '../../atoms/Dropdown/Dropdown.jsx';
import InfoDropdown from '../../atoms/InfoDropdown/InfoDropdown';
import Logo from '../../atoms/Logo/Logo.jsx';
import Profile from '../../atoms/Profile/Profile.jsx';
import styles from './NavBar.module.css';

function NavBar() {
  const { getCategories } = useProducts();
  const { isAuthenticated, userData, notifications } = useUser();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);

  // Datos de muestra para el perfil de usuario.
  const resolvedAvatar =
    (userData && (userData.imageUrl || userData.image_url)) ||
    'https://via.placeholder.com/150';

  const loggedUser = {
    userName: userData ? userData.username : 'Invitado',
    imageUrl: resolvedAvatar,
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
              <Dropdown title="Categorías" items={getCategories()} />
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
              {isAuthenticated && (
                <>
                  <li>
                    <InfoDropdown
                      title="Notificaciones"
                      items={notifications || []}
                      icon="notif"
                    />
                  </li>
                  <li>
                    <InfoDropdown
                      title="Favoritos"
                      items={favorites || []}
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
                </>
              )}

              <li className={styles['profile']}>
                {isAuthenticated ? (
                  <Profile
                    userName={loggedUser.userName}
                    imageUrl={loggedUser.imageUrl}
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
