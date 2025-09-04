// AuthService.jsx - Servicio centralizado de autenticación
const API_BASE_URL = 'http://localhost:9000';

class AuthService {
  
  // **LOGIN**
  static async login(credentials) {
    try {
      // Buscar usuario por email o username
      const response = await fetch(`${API_BASE_URL}/users`);
      const users = await response.json();
      
      const user = users.find(u => 
        (u.email === credentials.emailOrUsername || u.username === credentials.emailOrUsername) &&
        u.password === credentials.password &&
        u.isActive
      );

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Actualizar último login
      await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastLogin: new Date().toISOString()
        })
      });

      // Guardar en localStorage (sin password)
      const userSession = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        preferences: user.preferences,
        ...(user.sellerInfo && { sellerInfo: user.sellerInfo }),
        ...(user.adminInfo && { adminInfo: user.adminInfo })
      };

      localStorage.setItem('user', JSON.stringify(userSession));
      localStorage.setItem('isAuthenticated', 'true');

      return userSession;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // **LOGOUT**
  static logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.reload(); // Recargar para limpiar estado
  }

  // **REGISTRO**
  static async register(userData) {
    try {
      // Verificar si el usuario ya existe
      const response = await fetch(`${API_BASE_URL}/users`);
      const users = await response.json();
      
      const existingUser = users.find(u => 
        u.email === userData.email || u.username === userData.username
      );

      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      // Crear nuevo usuario
      const newUser = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buyer', // Por defecto comprador
        fullName: userData.fullName,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        preferences: {
          notifications: true,
          theme: 'light'
        }
      };

      const createResponse = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (!createResponse.ok) {
        throw new Error('Error al crear usuario');
      }

      const createdUser = await createResponse.json();
      
      // Auto-login después de registro
      return AuthService.login({
        emailOrUsername: userData.email,
        password: userData.password
      });

    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // **OBTENER USUARIO ACTUAL**
  static getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  // **VERIFICAR SI ESTÁ AUTENTICADO**
  static isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true' && AuthService.getCurrentUser() !== null;
  }

  // **VERIFICAR ROLES**
  static hasRole(requiredRole) {
    const user = AuthService.getCurrentUser();
    return user && user.role === requiredRole;
  }

  static isBuyer() {
    return AuthService.hasRole('buyer');
  }

  static isSeller() {
    return AuthService.hasRole('seller');
  }

  static isAdmin() {
    return AuthService.hasRole('admin');
  }

  // **VERIFICAR PERMISOS**
  static canEditProduct(productSellerId) {
    const user = AuthService.getCurrentUser();
    if (!user) return false;
    
    // Admin puede editar cualquier producto
    if (user.role === 'admin') return true;
    
    // Vendedor solo puede editar sus propios productos
    if (user.role === 'seller') {
      return productSellerId === user.id || productSellerId === user.username;
    }
    
    return false;
  }

  static canDeleteProduct() {
    return AuthService.isAdmin();
  }

  static canAddToCart() {
    // Solo usuarios autenticados pueden agregar al carrito
    return AuthService.isAuthenticated();
  }

  // **ACTUALIZAR PERFIL**
  static async updateProfile(userData) {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar perfil');
      }

      const updatedUser = await response.json();
      
      // Actualizar localStorage
      const userSession = {
        ...user,
        ...userData
      };
      localStorage.setItem('user', JSON.stringify(userSession));

      return userSession;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }
}

export default AuthService;
