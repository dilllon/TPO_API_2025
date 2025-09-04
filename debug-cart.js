// Script para agregar productos de prueba al carrito
// Ejecutar en la consola del navegador

// Primero verificar productos disponibles
async function checkProducts() {
    try {
        const response = await fetch('http://localhost:3001/products');
        const products = await response.json();
        console.log('Productos disponibles:', products);
        return products;
    } catch (error) {
        console.error('Error cargando productos:', error);
        return [];
    }
}

// Agregar primer producto al carrito
async function addProductToCart() {
    const products = await checkProducts();
    if (products.length > 0) {
        const firstProduct = products[0];
        const cartItem = {
            id: firstProduct.id,
            qty: 1
        };
        
        const currentCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        currentCart.push(cartItem);
        localStorage.setItem('cartItems', JSON.stringify(currentCart));
        
        console.log('Producto agregado al carrito:', cartItem);
        console.log('Carrito actual:', currentCart);
        
        // Disparar evento para notificar cambios
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'cartItems',
            newValue: JSON.stringify(currentCart)
        }));
    }
}

// Verificar carrito actual
function checkCart() {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    console.log('Carrito actual:', cart);
    return cart;
}

// Limpiar carrito
function clearCart() {
    localStorage.setItem('cartItems', '[]');
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'cartItems',
        newValue: '[]'
    }));
    console.log('Carrito limpiado');
}

console.log('Funciones disponibles:');
console.log('- checkProducts(): Ver productos disponibles');
console.log('- addProductToCart(): Agregar primer producto al carrito');
console.log('- checkCart(): Ver carrito actual');
console.log('- clearCart(): Limpiar carrito');
