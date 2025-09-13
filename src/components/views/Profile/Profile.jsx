import { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import Header from '../../organisms/Header/Header';
import { FaPencilAlt } from 'react-icons/fa';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) return;

    fetch(`http://localhost:9000/user`)
      .then(res => res.json())
      .then(users => {
        const foundUser = users.find(u => parseInt(u.id) === parseInt(JSON.parse(userData).id));
        setUser(foundUser);
      })
      .catch(err => console.error(err));
  }, []);

  if (!user) return <div>Cargando...</div>;


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
        style={{ backgroundImage: `url("${user.bannerUrl}")` }}
        role="img"
        aria-label="Profile cover image"
      />

      <div className={styles['body-container']}>
        {/* Content row */}
        <div className={styles.content}>
          {/* Avatar */}
          <img
            className={styles.avatar}
            src={user.imageUrl}
            alt={`${user.name} avatar`}
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
              <h1 className={styles.name}>{name}</h1>
            </div>

            <div className={styles.meta}>
              <span className={styles.handle}>@{user.firstName}</span>
              <span className={styles.dot} />
              <span className={styles.muted}>Joined Mar 2023</span>
              <span className={styles.dot} />
              <span className={styles.muted}>Active 3 days ago</span>
            </div>

            <div className={styles.stats}>
              <span className={styles.stat}>
                <strong>{user.favorites}</strong> favoritos
              </span>
              <span className={styles.dot} />
              <span className={styles.stat}>
                <strong>{user.watchlists}</strong> lista de seguimiento
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
                <span className={styles.value}>{user.gender}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Código de identificación</span>
                <span className={styles.value}>{user.identifyCode}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Nacionalidad</span>
                <span className={styles.value}>{user.nationality}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Idioma</span>
                <span className={styles.value}>{user.language}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Dirección permanente</span>
                <span className={styles.value}>{user.permanentAddress}</span>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.row}>
                <span className={styles.label}>Fecha de nacimiento</span>
                <span className={styles.value}>{user.dateOfBirth}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Ciudad natal</span>
                <span className={styles.value}>{user.hometown}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Religión</span>
                <span className={styles.value}>{user.religion}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Estado civil</span>
                <span className={styles.value}>{user.maritalStatus}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Dirección actual</span>
                <span className={styles.value}>{user.currentAddress}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
