import { FaSearch } from 'react-icons/fa';
import styles from './Buscador.module.css';
import { useSearch } from '../../../context/SearchContext';

function Buscador() {
  const { searchTerm, setSearchTerm } = useSearch();
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
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </form>
  );
}

export default Buscador;
