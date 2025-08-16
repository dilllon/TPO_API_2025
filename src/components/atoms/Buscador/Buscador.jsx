import "./Buscador.css";

function Buscador() {
  return (
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input type="search" placeholder="Buscar..." aria-label="Buscar" />
          </form>
  );
}

export default Buscador;
