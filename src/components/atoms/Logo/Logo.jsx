import styles from './Logo.module.css';

function Logo() {
  return (
    <a href="/" className={styles['logo']}>
      {/* <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={styles['logo-icon']}
      >
        <path d="M7 4h-2l-3 9v2a1 1 0 001 1h1a4 4 0 108 0h1a1 1 0 001-1v-2l-3-9h-2l1 3h-4l1-3zm-1 14a2 2 0 110-4 2 2 0 010 4zm10-2a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg> */}
      <span className={styles['logo-text']}>
        Ama<span className={styles['logo-highlight']}>Zone</span>
      </span>
    </a>
  );
}

export default Logo;
