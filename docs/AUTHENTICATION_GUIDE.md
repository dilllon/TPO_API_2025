# Sistema de Autenticación - Credenciales de Prueba

## Usuarios Disponibles

### 👤 **Comprador (Buyer)**
- **Email:** `comprador@gmail.com`
- **Password:** `comprador123`
- **Rol:** Buyer
- **Permisos:** 
  - Ver productos
  - Agregar al carrito
  - Realizar compras
  - Ver su perfil

### 🏪 **Vendedor (Seller)**
- **Email:** `vendedor@gmail.com`
- **Password:** `vendedor123`
- **Rol:** Seller
- **Permisos:**
  - Ver productos
  - Crear nuevos productos
  - Editar sus propios productos
  - Ver sus ventas
  - Gestionar su perfil

### 👑 **Administrador (Admin)**
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **Rol:** Admin
- **Permisos:**
  - Acceso completo al sistema
  - Gestionar todos los productos
  - Gestionar todos los usuarios
  - Ver todas las estadísticas
  - Eliminar productos de cualquier vendedor

## Endpoints de la API

### JSON Server corriendo en: `http://localhost:3001`

**Usuarios:**
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener usuario por ID
- `GET /users?email=email@example.com` - Buscar por email
- `POST /users` - Crear nuevo usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

**Productos:**
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID
- `GET /products?sellerId=seller1` - Productos por vendedor
- `GET /products?category=categoria` - Productos por categoría
- `GET /products?name_like=búsqueda` - Buscar productos
- `POST /products` - Crear nuevo producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

## Funcionalidades del Sistema

### 🔐 **Autenticación**
- Login con email y password
- Registro de nuevos usuarios (por defecto rol 'buyer')
- Logout con limpieza de sesión
- Persistencia de sesión con localStorage

### 🛡️ **Autorización por Roles**
- **Buyer:** Solo puede ver y comprar productos
- **Seller:** Puede gestionar sus propios productos
- **Admin:** Acceso completo al sistema

### 📦 **Gestión de Productos**
- Visualización de productos con descuentos
- Búsqueda y filtrado por categoría
- CRUD completo según permisos de usuario
- Asociación de productos con vendedores

### 🎨 **Interfaz de Usuario**
- Navegación adaptativa según rol
- Carrusel de productos con controles
- Sistema de badges de descuento
- Formularios de autenticación

## Estructura de la Base de Datos

### Usuarios
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "buyer|seller|admin",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "address": {...},
  "createdAt": "ISO Date",
  "lastLogin": "ISO Date",
  "isActive": boolean
}
```

### Productos
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": number,
  "discount": number,
  "category": "string",
  "sellerId": "string",
  "image": "string",
  "stock": number,
  "sku": "string",
  "rating": {...},
  "createdAt": "ISO Date"
}
```

## Comandos Útiles

```bash
# Iniciar el servidor de desarrollo (React)
npm run dev

# Iniciar JSON Server (API)
npm run json-server

# Verificar que JSON Server está funcionando
# Navegar a: http://localhost:3001/users
# Navegar a: http://localhost:3001/products
```

## Próximos Pasos

1. ✅ **JSON Server configurado y funcionando**
2. ✅ **API de servicios creada**
3. ✅ **AuthContext actualizado**
4. ✅ **Hook de productos creado**
5. 🔄 **Integrar AuthContext en la aplicación**
6. 🔄 **Actualizar componentes para usar la API**
7. 🔄 **Probar el flujo completo de autenticación**
