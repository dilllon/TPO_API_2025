import React, { useState } from "react";
import "./NavBar.css";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <a className="titulo" href="#">Tienda Online</a>

        {/* Botón hamburguesa */}
        <button
          className="burger"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

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
          </ul>

          {/* Buscador */}
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input type="search" placeholder="Buscar..." aria-label="Buscar" />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
