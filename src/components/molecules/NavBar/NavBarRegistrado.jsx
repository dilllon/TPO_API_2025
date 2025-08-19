import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import contactoimg from '../../../assets/images/contactoimg.jpg';
import crearcuentaimg from '../../../assets/images/crearusuarioimg.jpg';
import icono from '../../../assets/images/editarperfil.jpg';
import { getCategoryNames } from '../../../constants/products';
import Logo from "../../Logo/Logo.jsx";
import Buscador from "../../atoms/Buscador/Buscador.jsx";
import "./NavBar.css";



function NavBarRegistrado() {
  const [menuOpen, setMenuOpen] = useState(false);
  const categoryNames = getCategoryNames();

  // Estado para contar items del carrito
  const [cantItems, setCantItems] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      return cart.reduce((total, item) => total + (item.qty || 1), 0);
    } catch {
      return 0;
    }
  });

  // Función para actualizar el contador cuando se agreguen items
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCantItems(cart.reduce((total, item) => total + (item.qty || 1), 0));
    } catch {
      setCantItems(0);
    }
  };

  // Escuchar cambios en localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar un evento personalizado para cambios en la misma pestaña
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);


  // const [palabra, setPalabra] = useState('gato');
  


  return (
    <nav className="navbar">
      <div className="izquierda">
        <Logo/>
      </div>
      <div className="centro">

        <div className="PrimerRenglon">
        <Buscador/>

        {/* Botón hamburguesa */}
        <button
          className="burger"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        
        </div>

        <div className="SegundoRenglon">
          {/* Menú */}
          <div className={`nav-menu ${menuOpen ? "show" : ""}`}>
            <ul className="nav-list">
              <li><a href="/">Inicio</a></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle">Categorías ▼</a>
                <ul className="dropdown-menu">
                  {categoryNames.map((categoryName, index) => (
                    <li key={index}>
                      <a href={`#category-${categoryName.toLowerCase()}`}>
                        {categoryName}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>  
              <li><a href="/cart">Mis compras</a></li>
              <li className="cart-nav-item">
                <div className="cart-icon-nav">
                  <FaShoppingCart size={20} />
                  {cantItems > 0 && <span className="cart-badge-nav">{cantItems}</span>}
                </div>
              </li>
            </ul>
          </div>
          

          

        </div>


        

      </div>
      <div className="derecha">
      {/* Botones de usuario */}
      <div className={`userbuttons nav-menu ${menuOpen ? "show" : ""}`}>

        <div className="user-wrapper">
          <a className="user-btn" aria-label="Perfil" href="/r">
            <img src={icono} alt="Perfil" />
            <span className="user-label">Perfil</span>
          </a>
        </div>

        <div className="user-wrapper">
          <a className="user-btn" aria-label="Crear cuenta" href="/">
            <img src={crearcuentaimg} alt="Crear cuenta" />
            <span className="user-label">Salir</span>
          </a>
        </div>

        <div className="user-wrapper">
          <a className="user-btn" aria-label="Carrito" href="/register">
            <img src={contactoimg} alt="Carrito" />
            <span className="user-label">Contacto</span>
          </a>
        </div>

      </div>
    </div>


    </nav>
  );
}

export default NavBarRegistrado;