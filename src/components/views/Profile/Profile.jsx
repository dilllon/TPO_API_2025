import Header from '../../organisms/Header/Header';
import { FaPencilAlt } from 'react-icons/fa';
import styles from './Profile.module.css';
import { useUser } from '@/context/UserContext';

const safeValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value;
};

export default function Profile() {
  const { userData, isLoading } = useUser();
  const user = userData;

  if (isLoading) {
    return (
      <section className={styles.wrapper} aria-label="Profile">
        <Header />
        <div className={styles['body-container']}>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className={styles.wrapper} aria-label="Profile">
        <Header />
        <div className={styles['body-container']}>
          <p>No se encontró la información del usuario.</p>
        </div>
      </section>
    );
  }

  const displayName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.username ||
    'Usuario';
  const handle = user.username || user.email || 'usuario';
  const bannerUrl = user.bannerUrl || 'https://picsum.photos/seed/profile-banner/1000/300';
  const avatarUrl = user.imageUrl || 'https://picsum.photos/seed/profile-avatar/200/200';
  const favoritesCount = Array.isArray(user.favorites)
    ? user.favorites.length
    : Number(user.favorites ?? 0);
  const watchlistCount = Array.isArray(user.watchlists)
    ? user.watchlists.length
    : Number(user.watchlists ?? 0);

  const handleEditClick = () => {
    console.log('Editando');
  };

  const handleEdit2 = () => {
    console.log('Editando 2');
  };

  return (
    <section className={styles.wrapper} aria-label="Profile">
      <Header />
      {/* Cover */}
      <div
        className={styles.cover}
        style={{ backgroundImage: `url("${bannerUrl}")` }}
        role="img"
        aria-label="Profile cover image"
      />

      <div className={styles['body-container']}>
        {/* Content row */}
        <div className={styles.content}>
          {/* Avatar */}
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={`${displayName} avatar`}
            loading="lazy"
          />

          {/* Text block */}
          <div className={styles.info}>
            <button
              className={styles.editButton}
              onClick={handleEditClick}
              aria-label="Edit profile"
            >
              <FaPencilAlt />
            </button>

            <div className={styles.topRow}>
              <h1 className={styles.name}>{displayName}</h1>
            </div>

            <div className={styles.meta}>
              <span className={styles.handle}>@{handle}</span>
              <span className={styles.dot} />
              <span className={styles.muted}>Joined Mar 2023</span>
              <span className={styles.dot} />
              <span className={styles.muted}>Active 3 days ago</span>
            </div>

            <div className={styles.stats}>
              <span className={styles.stat}>
                <strong>{favoritesCount}</strong> favoritos
              </span>
              <span className={styles.dot} />
              <span className={styles.stat}>
                <strong>{watchlistCount}</strong> lista de seguimiento
              </span>
            </div>
          </div>
        </div>

        <section className={styles.card} aria-label="Información personal">
          <header className={styles.header}>
            <h2 className={styles.title}>Información personal</h2>

            <button
              type="button"
              className={styles.editBtn}
              aria-label="Edit personal information"
              onClick={handleEdit2}
            >
              <FaPencilAlt />
            </button>
          </header>

          <div className={styles.grid}>
            <div className={styles.col}>
              <div className={styles.row}>
                <span className={styles.label}>Género</span>
                <span className={styles.value}>{safeValue(user.gender)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Código de identificación</span>
                <span className={styles.value}>{safeValue(user.identifyCode)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Nacionalidad</span>
                <span className={styles.value}>{safeValue(user.nationality)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Idioma</span>
                <span className={styles.value}>{safeValue(user.language)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Dirección permanente</span>
                <span className={styles.value}>{safeValue(user.permanentAddress)}</span>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.row}>
                <span className={styles.label}>Fecha de nacimiento</span>
                <span className={styles.value}>{safeValue(user.dateOfBirth)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Ciudad natal</span>
                <span className={styles.value}>{safeValue(user.hometown)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Religión</span>
                <span className={styles.value}>{safeValue(user.religion)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Estado civil</span>
                <span className={styles.value}>{safeValue(user.maritalStatus)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Dirección actual</span>
                <span className={styles.value}>{safeValue(user.currentAddress)}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
