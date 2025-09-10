import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
// import crearCuentaImg from '../../../assets/images/crearusuarioimg.jpg';
// import icono from '../../../assets/images/icono.jpg';
// import { getCategoryNames } from '../../../constants/products';
import { useProducts } from '@/context/ProductContext';
import Logo from '../../atoms/Logo/Logo.jsx';
import Buscador from '../../atoms/Buscador/Buscador.jsx';
import Profile from '../../atoms/Profile/Profile.jsx';
import Dropdown from '../../atoms/Dropdown/Dropdown.jsx';
import InfoDropdown from '../../atoms/InfoDropdown/InfoDropdown';
import styles from './NavBar.module.css';
import { useUser } from '@/context/UserContext';

function NavBar() {
  const { getCategories  } = useProducts();
  const { isAuthenticated, canEdit, userData, favorites, notifications } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  // Datos de muestra para el perfil de usuario.
  const mockUser = {
    userName: userData ? userData.username : 'Invitado',
    imageUrl: userData ? userData.imageUrl : 'https://via.placeholder.com/150', // URL de Iron Man
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
                </>
              )}
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
                {isAuthenticated ? (
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
    </nav>
  );
}

export default NavBar;
