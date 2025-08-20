// import "./Categorias.css";
import { getCategoryNames } from '../../../constants/products';
import styles from './Categorias.module.css';

function Categorias() {
  const isLoggedIn =
    typeof window !== 'undefined' &&
    localStorage.getItem('isLoggedIn') === 'true';
  const base = isLoggedIn ? '/r' : '/';

  const categoryNames = getCategoryNames();
  return (
    <li className={styles['dropdown']}>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className={styles['dropdown-toggle']}
      >
        Categorías ▼
      </a>
      <ul className={styles['dropdown-menu']}>
        {categoryNames.map((categoryName, index) => (
          <li key={index}>
            <a href={`${base}#category-${categoryName.toLowerCase()}`}>
              {categoryName}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default Categorias;
