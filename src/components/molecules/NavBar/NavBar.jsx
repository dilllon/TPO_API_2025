import React, { useState } from "react";
import "./NavBar.css";
import icono from '../../../assets/images/icono.jpg';
import carrito from '../../../assets/images/carritodecompras.jpg';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container-fluid">

        <div className="PrimerRenglon">
        {/* Título de la tienda */}
        <a className="titulo" href="#">Tienda Online</a>

        {/* Botón hamburguesa */}
        <button
          className="burger"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Buscador */}
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input type="search" placeholder="Buscar..." aria-label="Buscar" />
            <button type="submit">Buscar</button>
          </form>
        </div>

        <div className="SegundoRenglon">
          {/* Menú */}
          <div className={`nav-menu ${menuOpen ? "show" : ""}`}>
            <ul className="nav-list">
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Catálogo</a></li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle">Dropdown ▼</a>
                <ul className="dropdown-menu">
                  <li><a href="#">Action</a></li>
                  <li><a href="#">Another action</a></li>
                  <li><a href="#">Something else here</a></li>
                </ul>
              </li>
              <li><a href="#">Categoria</a></li>
              <li><a href="#">Mis compras</a></li>
            </ul>
          </div>
          {/* Botones de usuario */}
          <div className="userbuttons">
            <a className="user-btn" aria-label="Perfil" href="/register">
              <img 
                src={icono} 
                alt="Perfil"
              />
            </a>
            <a className="user-btn" aria-label="Perfil" href="/register">
              <img 
                src={carrito} 
                alt="Perfil"
              />
            </a>
          </div>
        </div>




      </div>
    </nav>
  );
}

export default NavBar;
