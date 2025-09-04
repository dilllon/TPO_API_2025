// API Configuration for JSON Server
const API_BASE_URL = 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  PRODUCTS: `${API_BASE_URL}/products`,
  CATEGORIES: `${API_BASE_URL}/categories`,
};

// Generic API functions
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// User API functions
export const userAPI = {
  // Get all users
  getAll: () => apiRequest(API_ENDPOINTS.USERS),
  
  // Get user by ID
  getById: (id) => apiRequest(`${API_ENDPOINTS.USERS}/${id}`),
  
  // Get user by email (for login)
  getByEmail: (email) => apiRequest(`${API_ENDPOINTS.USERS}?email=${email}`),
  
  // Create new user
  create: (userData) => apiRequest(API_ENDPOINTS.USERS, {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Update user
  update: (id, userData) => apiRequest(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  // Delete user
  delete: (id) => apiRequest(`${API_ENDPOINTS.USERS}/${id}`, {
    method: 'DELETE',
  }),
};

// Product API functions
export const productAPI = {
  // Get all products
  getAll: () => apiRequest(API_ENDPOINTS.PRODUCTS),
  
  // Get product by ID
  getById: (id) => apiRequest(`${API_ENDPOINTS.PRODUCTS}/${id}`),
  
  // Get products by seller ID
  getBySeller: (sellerId) => apiRequest(`${API_ENDPOINTS.PRODUCTS}?sellerId=${sellerId}`),
  
  // Get products by category
  getByCategory: (category) => apiRequest(`${API_ENDPOINTS.PRODUCTS}?category=${category}`),
  
  // Search products by name
  search: (query) => apiRequest(`${API_ENDPOINTS.PRODUCTS}?name_like=${query}`),
  
  // Create new product
  create: (productData) => apiRequest(API_ENDPOINTS.PRODUCTS, {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  // Update product
  update: (id, productData) => apiRequest(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  // Delete product
  delete: (id) => apiRequest(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
    method: 'DELETE',
  }),
};

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const users = await userAPI.getByEmail(email);
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user && user.isActive) {
        // Update last login
        await userAPI.update(user.id, {
          ...user,
          lastLogin: new Date().toISOString(),
        });
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      } else {
        throw new Error('Invalid credentials or inactive user');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  // Register new user
  register: async (userData) => {
    try {
      // Check if email already exists
      const existingUsers = await userAPI.getByEmail(userData.email);
      if (existingUsers.length > 0) {
        throw new Error('Email already exists');
      }
      
      // Create new user with default role 'buyer'
      const newUser = {
        ...userData,
        id: Date.now().toString(), // Simple ID generation
        role: userData.role || 'buyer',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
      };
      
      const createdUser = await userAPI.create(newUser);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
};

export default {
  userAPI,
  productAPI,
  authAPI,
  API_ENDPOINTS,
};
