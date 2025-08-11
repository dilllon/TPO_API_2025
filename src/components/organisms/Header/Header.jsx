import './Header.css';
import Button from '@/components/atoms/Button/Button';

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
        <Button
          label="Buscar"
          variant="primary"
          onClick={() => (window.location.href = "/Productos")}
        />
      </div>
      <nav className="nav">
        <Button
          label="Inicio"
          variant="primary"
          onClick={() => alert("Ir a inicio")}
        />
        <Button
          label="Catálogo"
          variant="secondary"
          onClick={() => alert("Ir al catálogo")}
        />
        <Button
          label="Login"
          variant="secondary"
          onClick={() => (window.location.href = "/register")}
        />
        <Button
          label="Login"
          variant="secondary"
          onClick={() => (window.location.href = "/register")}
        />
        <Button
          label="Login"
          variant="secondary"
          onClick={() => (window.location.href = "/register")}
        />


        
      </nav>
    </header>
  );
}

export default Header;
