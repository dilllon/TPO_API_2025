import Button from '@/components/atoms/Button/Button.jsx';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from './Register.module.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    address: '',
    password: '',
    confirm: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirm) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    for (const key in formData) {
          localStorage.setItem(key, formData[key]);
          }


    console.log(
      'Usuario registrado y guardado en el estado de Redux:',
      formData,
    );
    navigate("/r");
  };

  return (
    <div className={styles['register-container']}>
      <div className={styles['container']}>
        <div className={styles['topbar']}>
          <Link to="/">
            <div className={styles['brand']}>AmaZone</div>
          </Link>
          <div className={styles['signin']}>
            ¿Ya tenés cuenta? <Link to="/clients/login">Iniciá sesión</Link>
          </div>
        </div>

        {/* Card */}
        <div className={styles['card']}>
          <h1>Crear Cuenta</h1>

          <form onSubmit={handleSubmit}>
            {/* Nombre / Apellido */}
            <div className={styles['grid']}>
              <div>
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Facundo"
                  autoComplete="off"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Tassone"
                  autoComplete="off"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className={styles['row']}>
              <div>
                <label htmlFor="username">Nombre de Usuario</label>
                <input
                  id="username"
                  type="text"
                  placeholder="mi_usuario123"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email / Address */}
            <div className={styles['grid']}>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="address">Dirección</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Av. Falsa 123"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Passwords */}
            <div className={styles['row']}>
              <div>
                <label htmlFor="password">Crear Contraseña</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm">Confirmar Contraseña</label>
                <input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="off"
                  value={formData.confirm}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div className={styles['actions']}>
              <Button type="submit" size="m">
                Crear Cuenta
              </Button>
            </div>
          </form>

          <div className={styles['footer']}>©Copyright 2030. AmaZone LLC.</div>
        </div>
      </div>
    </div>
  );
}

export default Register;
