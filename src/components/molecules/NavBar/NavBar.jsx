import { useState } from "react";
import contactoimg from '../../../assets/images/contactoimg.jpg';
import crearcuentaimg from '../../../assets/images/crearusuarioimg.jpg';
import icono from '../../../assets/images/icono.jpg';
import { getCategoryNames } from '../../../constants/products';
import Logo from "../../Logo/Logo.jsx";
import Buscador from "../../atoms/Buscador/Buscador.jsx";
import "./NavBar.css";



function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const categoryNames = getCategoryNames();


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
              <li><a href="#">Categoria</a></li>
              <li><a href="/cart">Mis compras</a></li>
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
            <span className="user-label">Ingresar</span>
          </a>
        </div>

        <div className="user-wrapper">
          <a className="user-btn" aria-label="Crear cuenta" href="/register">
            <img src={crearcuentaimg} alt="Crear cuenta" />
            <span className="user-label">Registrarse</span>
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

export default NavBar;