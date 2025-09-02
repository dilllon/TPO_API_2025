import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import styles from './Profile.module.css';
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice"; // ajustá la ruta

/**
 * Componente de perfil de usuario para la barra de navegación.
 * Muestra una imagen de perfil redonda y el nombre de usuario.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.userName - El nombre del usuario a mostrar.
 * @param {string} props.imageUrl - La URL de la imagen de perfil del usuario.
 */
const Profile = ({ userName, imageUrl }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
    const dispatch = useDispatch()

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Evita el scroll de la página al presionar espacio
      toggleDropdown();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Agrega el listener solo si el dropdown está abierto
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Función de limpieza para remover el listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      ref={dropdownRef}
      className={styles.profileContainer}
      tabIndex="0"
      role="button"
      aria-label={`Menú de perfil de ${userName}`}
      aria-haspopup="true"
      aria-expanded={isDropdownOpen}
      onClick={toggleDropdown}
      onKeyDown={handleKeyDown}
    >
      <img
        src={imageUrl}
        alt={`Foto de perfil de ${userName}`}
        className={styles.profileImage}
      />
      <span className={styles.profileUsername}>{userName}</span>
      {isDropdownOpen && (
        <ul className={styles.dropdownMenu}>
          <li>
            <a href="clients/profile">
              <svg
                className={styles['dropdownIcon']}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              <span>Mi perfil</span>
            </a>
          </li>
          <li>
            <a href="clients/previous-orders">
              <svg
                className={styles.dropdownIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L8 2.122l3.75 1.339 2.404-.961zm3.564 1.426L5.596 5.55 8 6.462l2.404-.912zM1.5 4.285l2.404.961L8 6.812l3.75-1.567 2.404-.961L8.25 2.62zM1 4.612l2.404.962L8 7.138l3.75-1.567 2.404-.962A.5.5 0 0 0 15 4.5v7a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5v-7A1.5 1.5 0 0 0 14.25 3.12l-6-2.4A.5.5 0 0 0 8 1a.5.5 0 0 0-.25.062l-6 2.4A1.5 1.5 0 0 0 1 4.5v7a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5z" />
              </svg>
              <span>Mis compras</span>
            </a>
          </li>
          <li>
            <a href="clients/favorites">
              <svg
                className={styles.dropdownIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
              </svg>
              <span>Favoritos</span>
            </a>
          </li>
          <li>
            <a href="clients/cart">
              <svg
                className={styles.dropdownIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
              <span>Carrito</span>
            </a>
          </li>
          <li className={styles.logoutItem}>
            <button>
              <svg
                className={styles.dropdownIcon}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 0 1 0v-2.5a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 0 4.5v9A1.5 1.5 0 0 0 1.5 15h8a1.5 1.5 0 0 0 1.5-1.5v-2.5a.5.5 0 0 0-1 0z"
                />
                <path
                  fillRule="evenodd"
                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
                />
              </svg>
              
              <span onClick={() => dispatch(logout())}>Cerrar sesión</span>
            </button>
          </li>
        </ul>
      )}    
    </div>
  );
};

Profile.propTypes = {
  userName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default Profile;
