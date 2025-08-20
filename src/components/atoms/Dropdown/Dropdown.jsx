import styles from './Dropdown.module.css';

/**
 * Componente genérico de Dropdown.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.title - El texto que se muestra en el botón que despliega el menú.
 * @param {Array<{label: string, href: string}>} [props.items=[]] - Un array de objetos para los elementos del menú.
 */
function Dropdown({ title, items = [] }) {
  return (
    <li className={styles['dropdown']}>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className={styles['dropdown-toggle']}
      >
        {title} ▼
      </a>
      <ul className={styles['dropdown-menu']}>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default Dropdown;
