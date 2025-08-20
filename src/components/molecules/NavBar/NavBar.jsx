import { useState } from 'react';
import contactoImg from '../../../assets/images/contactoimg.jpg';
import crearCuentaImg from '../../../assets/images/crearusuarioimg.jpg';
import icono from '../../../assets/images/icono.jpg';
import { getCategoryNames } from '../../../constants/products';
import Logo from '../../Logo/Logo.jsx';
import Buscador from '../../atoms/Buscador/Buscador.jsx';
import Dropdown from '../../atoms/Dropdown/Dropdown.jsx';
import styles from './NavBar.module.css';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
                <a href="/clients/login">Mis compras</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles['derecha']}>
        {/* Botones de usuario */}
        <div
          className={`${styles['userbuttons']} ${styles['nav-menu']} ${
            menuOpen ? styles['show'] : ''
          }`}
        >
          <div className={styles['user-wrapper']}>
            {/* Temporalmente va directo al home registrado ya que no tenemos base de datos */}
            <a
              className={styles['user-btn']}
              aria-label="Perfil"
              href="/clients/login"
            >
              {/* <a className="user-btn" aria-label="Perfil" href="/clients/login"> */}
              <img src={icono} alt="Perfil" />
              <span className={styles['user-label']}>Ingresar</span>
            </a>
          </div>

          <div className={styles['user-wrapper']}>
            <a
              className={styles['user-btn']}
              aria-label="Crear cuenta"
              href="/clients/register"
            >
              <img src={crearCuentaImg} alt="Crear cuenta" />
              <span className={styles['user-label']}>Registrarse</span>
            </a>
          </div>

          <div className={styles['user-wrapper']}>
            <a
              className={styles['user-btn']}
              aria-label="Carrito"
              href="/contacto"
            >
              <img src={contactoImg} alt="Carrito" />
              <span className={styles['user-label']}>Contacto</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
