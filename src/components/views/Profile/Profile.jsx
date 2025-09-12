import styles from './Profile.module.css';
import Header from '../../organisms/Header/Header';
import { FaPencilAlt } from 'react-icons/fa';

export default function Profile() {
  const userInformation = {
    coverUrl:
      'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=2400&auto=format&fit=crop',
    avatarUrl:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=600&auto=format&fit=crop',
    name: 'King Charles',
    handle: '@k1ng-charly',
    joinedText: 'Joined Mar 2023',
    activeText: 'Active 3 days ago',
    favorites: 2,
    watchlists: 0,
  };

  const extraData = {
    title: 'Personal information',
    left: [
      { label: 'Gender', value: 'Female' },
      { label: 'Identify code', value: '3234611342' },
      { label: 'Nationality', value: 'Vietnam' },
      { label: 'Language', value: 'Vietnamese, English' },
      {
        label: 'Permanent address',
        value: '5. Nguyen Chi Thanh Street, Tan Binh Ward, Hai Duong',
      },
    ],
    right: [
      { label: 'Date of birth', value: '5th March, 1996' },
      { label: 'Hometown', value: 'Hai Duong city' },
      { label: 'Religion', value: 'None' },
      { label: 'Marital status', value: 'Single' },
      {
        label: 'Current address',
        value: '29. Nguyen Ngoc Doan Street, Dong Da District, Ha Noi',
      },
    ],
  };

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
        style={{ backgroundImage: `url("${userInformation.coverUrl}")` }}
        role="img"
        aria-label="Profile cover image"
      />

      <div className={styles['body-container']}>
        {/* Content row */}
        <div className={styles.content}>
          {/* Avatar */}
          <img
            className={styles.avatar}
            src={userInformation.avatarUrl}
            alt={`${userInformation.name} avatar`}
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
              <span className={styles.handle}>{userInformation.handle}</span>
              <span className={styles.dot} />
              <span className={styles.muted}>{userInformation.joinedText}</span>
              <span className={styles.dot} />
              <span className={styles.muted}>{userInformation.activeText}</span>
            </div>

            <div className={styles.stats}>
              <span className={styles.stat}>
                <strong>{userInformation.favorites}</strong> favorites
              </span>
              <span className={styles.dot} />
              <span className={styles.stat}>
                <strong>{userInformation.watchlists}</strong> watchlists
              </span>
            </div>
          </div>
        </div>
        <section className={styles.card} aria-label={extraData.title}>
          <header className={styles.header}>
            <h2 className={styles.title}>{extraData.title}</h2>

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
              {extraData.left.map((item, i) => (
                <div className={styles.row} key={`l-${i}`}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.value}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.col}>
              {extraData.right.map((item, i) => (
                <div className={styles.row} key={`r-${i}`}>
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.value}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
