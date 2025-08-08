import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="titulo">Tienda Online</h1>

      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="input-busqueda"
        />
        <button className="btn-buscar">Buscar</button>
      </div>
      <nav className="nav">
        <a href="#" className="nav-link">
          Inicio
        </a>
        <a href="#" className="nav-link">
          Catálogo
        </a>
        <a href="#" className="nav-link">
          Login
        </a>
      </nav>
    </header>
  );
}

export default Header;
