const API_BASE_URL = 'http://localhost:9000';

export const authService = {
  // Función para generar un nuevo ID
  async generateUserId() {
    try {
      const response = await fetch(`${API_BASE_URL}/user`);
      const users = await response.json();
      
      const maxId = users.reduce((max, user) => {
        const userId = parseInt(user.id);
        return userId > max ? userId : max;
      }, 0);
      
      return (maxId + 1).toString();
    } catch (error) {
      console.error('Error al generar ID:', error);
      return Date.now().toString();
    }
  },

  // Función para verificar si el usuario ya existe
  async checkUserExists(username, email) {
    try {
      const response = await fetch(`${API_BASE_URL}/user`);
      const users = await response.json();
      
      return users.find(user => 
        user.username.toLowerCase() === username.toLowerCase() || 
        user.email.toLowerCase() === email.toLowerCase()
      );
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  },

  // Función principal para registrar usuario
  async registerUser(userData) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.checkUserExists(userData.username, userData.email);
      
      if (existingUser) {
        if (existingUser.username.toLowerCase() === userData.username.toLowerCase()) {
          throw new Error('El nombre de usuario ya está en uso');
        }
        if (existingUser.email.toLowerCase() === userData.email.toLowerCase()) {
          throw new Error('El email ya está registrado');
        }
      }

      // Generar nuevo ID
      const newUserId = await this.generateUserId();

      // Crear objeto de usuario
      const newUser = {
        id: newUserId,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: "buyer",
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || "",
        address: {
          street: userData.address || "",
          city: "",
          province: "",
          zipCode: "",
          country: "Argentina"
        },
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true,
        imageUrl: "https://picsum.photos/50"
      };

      // Enviar datos a JSON Server
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      return await response.json();

    } catch (error) {
      throw error;
    }
  },

  // Función para login
  async loginUser(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/user`);
      const users = await response.json();
      
      const user = users.find(u => 
        (u.username === username || u.email === username) && 
        u.password === password
      );

      if (!user) {
        throw new Error('Credenciales incorrectas');
      }

      // Actualizar lastLogin
      await fetch(`${API_BASE_URL}/user/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastLogin: new Date().toISOString()
        })
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
};