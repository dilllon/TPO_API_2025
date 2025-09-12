import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { getProductById, hasDiscount, calculateDiscountedPrice, isLoading } = useProducts();
  const [removing, setRemoving] = useState(new Set());
  const ANIM_MS = 220;

  const [products, setProducts] = useState(() => {
    try {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      return items.map(item => ({
        ...item,
        id: typeof item.id === 'string' ? parseInt(item.id) : item.id
      }));
    } catch {
      return [];
    }
  });

  // Sincronizar estado con localStorage (solo para otras pestañas)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'cartItems' && e.storageArea === localStorage) {
        try {
          const items = JSON.parse(e.newValue || '[]');
          setProducts(items.map(item => ({
            ...item,
            id: typeof item.id === 'string' ? parseInt(item.id) : item.id
          })));
        } catch (error) {
          console.error('Error syncing cart from storage:', error);
          setProducts([]);
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const totalItems = products.reduce((a, p) => a + (p.qty || 1), 0);

  const totalPrice = products.reduce((a, p) => {
    if (isLoading) return a;
    
    const product = getProductById(p.id);
    if (!product) return a;
    
    const finalPrice = hasDiscount(product)
      ? calculateDiscountedPrice(product)
      : product.price;
      
    return a + finalPrice * (p.qty || 1);
  }, 0);

  const addToCart = (product, quantity = 1) => {
    setProducts(prevProducts => {
      const existingItem = prevProducts.find(item => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevProducts.map(item =>
          item.id === product.id
            ? { ...item, qty: (item.qty || 1) + quantity }
            : item
        );
      } else {
        updatedCart = [...prevProducts, { ...product, qty: quantity }];
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setRemoving(prev => new Set(prev).add(id));

    setTimeout(() => {
      setProducts(prevProducts => {
        const updatedCart = prevProducts.filter(item => item.id !== id);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        return updatedCart;
      });

      setRemoving(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, ANIM_MS + 20);
  };

  const updateQuantity = (id, newQty) => {
    setProducts(prevProducts => {
      const updatedCart = prevProducts.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, newQty) } : item
      );

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setProducts([]);
    localStorage.setItem('cartItems', '[]');
  };

  const getCartItemById = (id) => {
    return products.find(item => item.id === id);
  };

  return (
    <CartContext.Provider value={{
      products,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartItemById,
      removing,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}