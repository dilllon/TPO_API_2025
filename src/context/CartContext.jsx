import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext();
const PURCHASES_API_URL = import.meta.env.VITE_PURCHASES_API_URL ?? 'http://localhost:8080/api/purchases';

export function CartProvider({ children }) {
  const { getProductById, hasDiscount, calculateDiscountedPrice, isLoading, refreshProducts } = useProducts();
  const [removing, setRemoving] = useState(new Set());
  const ANIM_MS = 220;

  const [products, setProducts] = useState(() => {
    try {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      return items.map((item) => ({
        ...item,
        id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'cartItems' && e.storageArea === localStorage) {
        try {
          const items = JSON.parse(e.newValue || '[]');
          setProducts(
            items.map((item) => ({
              ...item,
              id: typeof item.id === 'string' ? parseInt(item.id, 10) : item.id,
            })),
          );
        } catch (error) {
          console.error('Error syncing cart from storage:', error);
          setProducts([]);
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const handleCartClear = () => {
      setProducts([]);
      localStorage.setItem('cartItems', '[]');
    };

    window.addEventListener('cart:clear', handleCartClear);
    return () => window.removeEventListener('cart:clear', handleCartClear);
  }, []);

  function buildPurchaseItems(cartItems, utilities) {
    const { getProductById: getProduct, hasDiscount: checkDiscount, calculateDiscountedPrice: calcDiscounted } =
      utilities;

    return cartItems.map((cartItem) => {
      const product = getProduct(cartItem.id);
      const unitPrice = checkDiscount(product) ? calcDiscounted(product) : product.price;

      return {
        productId: product.id,
        title: product.title,
        pricePaid: Number(unitPrice),
        qty: Math.max(1, cartItem.qty || 1),
        thumbnail: product.thumbnail || product.image || '',
      };
    });
  }

  async function savePurchase(purchaseItems) {
    const token = localStorage.getItem('token');

    const res = await fetch(PURCHASES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ items: purchaseItems }),
    });

    if (!res.ok) {
      let msg = 'Error guardando la compra';
      try {
        const err = await res.json();
        if (err?.message) msg = err.message;
      } catch {
        throw new Error(msg);
      }
    }

    const savedPurchase = await res.json();

    try {
      await refreshProducts();
    } catch (error) {
      console.warn('No se pudo refrescar el catalogo de productos después de la compra:', error);
    }

    return savedPurchase;
  }

  const totalItems = products.reduce((acc, product) => acc + (product.qty || 1), 0);

  const totalPrice = products.reduce((acc, productInCart) => {
    if (isLoading) return acc;

    const product = getProductById(productInCart.id);
    if (!product) return acc;

    const finalPrice = hasDiscount(product) ? calculateDiscountedPrice(product) : product.price;

    return acc + finalPrice * (productInCart.qty || 1);
  }, 0);

  const addToCart = (product, quantity = 1) => {
    setProducts((prevProducts) => {
      const existingItem = prevProducts.find((item) => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = prevProducts.map((item) => (item.id === product.id ? { ...item, qty: (item.qty || 1) + quantity } : item));
      } else {
        updatedCart = [...prevProducts, { ...product, qty: quantity }];
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setRemoving((prev) => new Set(prev).add(id));

    setTimeout(() => {
      setProducts((prevProducts) => {
        const updatedCart = prevProducts.filter((item) => item.id !== id);
        localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        return updatedCart;
      });

      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, ANIM_MS + 20);
  };

  const updateQuantity = (id, newQty) => {
    setProducts((prevProducts) => {
      const updatedCart = prevProducts.map((item) => (item.id === id ? { ...item, qty: Math.max(1, newQty) } : item));

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setProducts([]);
    localStorage.setItem('cartItems', '[]');
  };

  const getCartItemById = (id) => {
    return products.find((item) => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemById,
        removing,
        isLoading,
        buildPurchaseItems,
        savePurchase,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
