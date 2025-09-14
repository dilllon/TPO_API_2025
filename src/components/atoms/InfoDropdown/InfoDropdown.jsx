import { useState, useRef, useEffect } from 'react';
import { IoNotifications } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import styles from './InfoDropdown.module.css';
import defaultImage from '@/assets/icons/az_default_icon.png';

function InfoDropdown({
  title = 'Notificaciones',
  items = [],
  icon = 'notif',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hook para cerrar el dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderIcon = () => {
    switch (icon) {
      case 'fav':
        return <FaHeart />;
      case 'notif':
      default:
        return <IoNotifications />;
    }
  };

  return (
    <div className={styles['notifications-dropdown']} ref={dropdownRef}>
      <button
        className={styles['trigger-button']}
        onClick={() => setIsOpen(!isOpen)}
        title={title}
      >
        {renderIcon()}
      </button>

      {isOpen && (
        <div className={styles['dropdown-panel']}>
          <div className={styles['panel-header']}>
            <h3>{title}</h3>
          </div>
          <ul className={styles['notification-list']}>
            {items.length > 0 ? (
              items.map((item) => (
                <li key={item.id} className={styles['notification-item']}>
                  {title === 'Favoritos' ? (
                    <>
                      <img
                        src={item.image ?? defaultImage}
                        alt={item.title}
                        className={styles['notification-image']}
                      />
                      <div className={styles['notification-body']}>
                        <p className={styles['notification-message']}>
                          {item.title}
                        </p>
                        <span className={styles['notification-timestamp']}>
                          ${item.price}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={item.displayImage ?? defaultImage}
                        alt="Notificación"
                        className={styles['notification-image']}
                      />
                      <div className={styles['notification-body']}>
                        <p className={styles['notification-message']}>
                          {item.message}
                        </p>
                        <span className={styles['notification-timestamp']}>
                          {item.timestamp}
                        </span>
                      </div>
                    </>
                  )}
                </li>
              ))
            ) : (
              <li className={styles['no-notifications']}>
                {title === 'Favoritos'
                  ? 'No tienes favoritos.'
                  : 'No tienes notificaciones nuevas.'}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default InfoDropdown;
