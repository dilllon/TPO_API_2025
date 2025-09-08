import { FaSearch } from 'react-icons/fa';
import styles from './Buscador.module.css';


function Buscador({ value, onChange }) {
  return (
    <form
      className={styles['search-form']}
      onSubmit={(e) => e.preventDefault()}
    >
      <FaSearch className={styles['search-icon']} />
      <input
        className={styles['search-input']}
        type="search"
        placeholder="Buscar productos, marcas y más..."
        aria-label="Buscar"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </form>
  );
}

export default Buscador;
