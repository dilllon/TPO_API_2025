import { useEffect, useState } from 'react';
import Header from '../../organisms/Header/Header';
import { FaPencilAlt } from 'react-icons/fa';
import styles from './Profile.module.css';
import { useUser } from '@/context/UserContext';
import { API_BASE_URL } from '@/config/api';
import { useFavorites } from '@/hooks/useFavorite';

const safeValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value;
};

const buildAuthHeaderValue = (token, tokenType) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return null;
  }

  if (trimmedToken.toLowerCase().startsWith('bearer ')) {
    return trimmedToken;
  }

  const prefix =
    typeof tokenType === 'string' && tokenType.trim().length > 0
      ? tokenType.trim()
      : 'Bearer';

  return `${prefix} ${trimmedToken}`;
};

const formatJoinedDate = (value) => {
  if (!value) {
    return 'Desconocido';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Desconocido';
  }

  return new Intl.DateTimeFormat('es-AR', {
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export default function Profile() {
  const { userData, isLoading } = useUser();
  const { favoritesCount: contextFavoritesCount } = useFavorites();
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    imageUrl: '',
    bannerUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!userData || !userData.id) {
        setProfileLoading(false);
        return;
      }

      const authHeader = buildAuthHeaderValue(userData.token, userData.type);
      if (!authHeader) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        setProfileError(null);

        const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: authHeader,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload = await response.json();
        if (isMounted) {
          setProfileData(payload);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error al obtener perfil de usuario:', error);
          setProfileError('No se pudo cargar la informaciÃ³n del usuario.');
        }
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userData?.id, userData?.token, userData?.type]);

  const user = profileData || userData;
  const isBusy = isLoading || profileLoading;

  if (isBusy) {
    return (
      <section className={styles.wrapper} aria-label="Profile">
        <Header />
        <div className={styles['body-container']}>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (profileError) {
    return (
      <section className={styles.wrapper} aria-label="Profile">
        <Header />
        <div className={styles['body-container']}>
          <p>{profileError}</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className={styles.wrapper} aria-label="Profile">
        <Header />
        <div className={styles['body-container']}>
          <p>No se encontrÃ³ la informaciÃ³n del usuario.</p>
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
  const bannerUrl =
    user.bannerUrl ||
    user.banner_url ||
    'https://picsum.photos/seed/profile-banner/1000/300';
  const avatarUrl =
    user.imageUrl ||
    user.image_url ||
    'https://picsum.photos/seed/profile-avatar/200/200';
  const favoritesCount = Number.isFinite(contextFavoritesCount)
    ? contextFavoritesCount
    : Array.isArray(user.favorites)
    ? user.favorites.length
    : Number(user.favorites ?? 0);
  const watchlistCount = Array.isArray(user.watchlists)
    ? user.watchlists.length
    : Number(user.watchlists ?? 0);
  const personalInfo = [
    { label: 'Direccion', value: safeValue(user.address) },
    { label: 'Telefono', value: safeValue(user.phone) },
    { label: 'Rol', value: safeValue(user.role) },
    { label: 'Idioma', value: 'Espanol' },
  ];
  const joinedDateLabel = formatJoinedDate(user.createdAt || user.created_at);

  const handleEditClick = () => {
    if (!user) {
      return;
    }

    setEditForm({
      username: user.username ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      address: user.address ?? '',
      phone: user.phone ?? '',
      imageUrl: user.imageUrl ?? user.image_url ?? '',
      bannerUrl: user.bannerUrl ?? user.banner_url ?? '',
    });
    setSubmitError(null);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    if (isSubmitting) {
      return;
    }
    setIsEditModalOpen(false);
    setSubmitError(null);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!userData || !userData.id) {
      setSubmitError('No se puede actualizar el usuario en este momento.');
      return;
    }

    const authHeader = buildAuthHeaderValue(userData.token, userData.type);
    if (!authHeader) {
      setSubmitError('Sesión inválida. Por favor vuelve a iniciar sesión.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        username: editForm.username?.trim() || null,
        firstName: editForm.firstName?.trim() || null,
        lastName: editForm.lastName?.trim() || null,
        address: editForm.address?.trim() || null,
        phone: editForm.phone?.trim() || null,
        imageUrl: editForm.imageUrl?.trim() || null,
        bannerUrl: editForm.bannerUrl?.trim() || null,
      };

      const response = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          errorPayload?.message ||
          errorPayload?.error ||
          `No se pudo actualizar el usuario (HTTP ${response.status})`;
        throw new Error(message);
      }

      const updatedUser = await response.json();
      setProfileData(updatedUser);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          ...(userData || {}),
          ...updatedUser,
        })
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setSubmitError(error.message || 'Error inesperado al guardar los cambios.');
    } finally {
      setIsSubmitting(false);
    }
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
            <button className={styles.editButton} onClick={handleEditClick} aria-label="Edit profile">
              <FaPencilAlt />
            </button>

            <div className={styles.topRow}>
              <h1 className={styles.name}>{displayName}</h1>
            </div>

            <div className={styles.meta}>
              <span className={styles.handle}>@{handle}</span>
              <span className={styles.dot} />
              <span className={styles.muted}>Joined {joinedDateLabel}</span>
              <span className={styles.dot} />
              <span className={styles.muted}>Active Now</span>
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

        <section className={styles.card} aria-label="Informacion personal">
          <header className={styles.header}>
            <h2 className={styles.title}>Informacion personal</h2>


          </header>

          <div className={styles.grid}>
            {personalInfo.map(({ label, value }) => (
              <div key={label} className={styles.row}>
                <span className={styles.label}>{label}</span>
                <span className={styles.value}>{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isEditModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          onClick={handleModalClose}
        >
          <div
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <h3>Editar perfil</h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={handleModalClose}
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>

            <form className={styles.modalForm} onSubmit={handleEditSubmit}>
              <div className={styles.modalField}>
                <label htmlFor="username">Usuario</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={editForm.username}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={editForm.firstName}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={editForm.lastName}
                  onChange={handleFieldChange}
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="address">Dirección</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={editForm.address}
                  onChange={handleFieldChange}
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={editForm.phone}
                  onChange={handleFieldChange}
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="imageUrl">Imagen de perfil (URL)</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={editForm.imageUrl}
                  onChange={handleFieldChange}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.modalField}>
                <label htmlFor="bannerUrl">Imagen de banner (URL)</label>
                <input
                  id="bannerUrl"
                  name="bannerUrl"
                  type="url"
                  value={editForm.bannerUrl}
                  onChange={handleFieldChange}
                  placeholder="https://..."
                />
              </div>

              {submitError && <p className={styles.modalError}>{submitError}</p>}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalSecondary}
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.modalPrimary} disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}


