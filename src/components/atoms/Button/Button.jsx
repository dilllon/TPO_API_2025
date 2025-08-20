import styles from './Button.module.css';

/**
 * Componente de botón atómico y reutilizable.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {React.ReactNode} props.children - El contenido del botón (texto, íconos, etc.).
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - El tipo de botón.
 * @param {'primary' | 'secondary'} [props.color='primary'] - La variante de color del botón.
 * @param {'s' | 'm' | 'l'} [props.size='m'] - El tamaño del botón.
 * @param {object} props.rest - Cualquier otra prop que se le quiera pasar al elemento <button> (ej. onClick, disabled).
 */
function Button({
  children,
  type = 'button',
  color = 'primary',
  size = 'm',
  ...rest
}) {
  // Construimos las clases dinámicamente
  const classNames = [
    styles['btn'],
    styles[`size-${size}`], // ej. styles['size-m']. s/m/l
    styles[`color-${color}`], // ej. styles['color-primary']
  ].join(' ');

  return (
    <button type={type} className={classNames} {...rest}>
      {children}
    </button>
  );
}

export default Button;
