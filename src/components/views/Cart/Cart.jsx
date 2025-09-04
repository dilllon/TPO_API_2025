import ProductCardAdded from '@/components/molecules/ProductCard/ProductCardAdded';
import Header from '@/components/organisms/Header/Header';
import { useEffect, useState } from 'react';
import { calculateDiscountedPrice, hasDiscount } from '../../../constants/products';
import { useProducts } from '../../../hooks/useProducts';
import './Cart.css';

function Cart() {
  const [removing, setRemoving] = useState(new Set());
  const ANIM_MS = 220; // misma duración que en el CSS
  const [showPopup, setShowPopup] = useState(false);
  const { products: allProducts, loading, getProductById } = useProducts();
  const [cartProducts, setCartProducts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cartItems') || '[]');
    } catch {
      return [];
    }
  });

  // Opcional: si querés refrescar cuando cambie desde otra pestaña
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'cartItems') {
        setCartProducts(JSON.parse(e.newValue || '[]'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const totalItems = cartProducts.reduce((a, p) => a + (p.qty || 1), 0);
  const totalPrice = cartProducts.reduce((a, p) => {
    const product = getProductById(p.id);
    if (!product) return a;
    const finalPrice = hasDiscount(product)
      ? calculateDiscountedPrice(product)
      : product.price || 0;
    return a + finalPrice * (p.qty || 1);
  }, 0);

  const removeOne = (id) => {
    // 1) activar clase de animación
    setRemoving((prev) => new Set(prev).add(id));

    // 2) al finalizar la transición, borrar de verdad
    setTimeout(() => {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const i = cart.findIndex((it) => it.id === id);
      if (i >= 0) {
        cart.splice(i, 1);
      }
      localStorage.setItem('cartItems', JSON.stringify(cart));
      // Dispara un evento de storage para notificar a otros componentes
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'cartItems',
          newValue: JSON.stringify(cart),
        }),
      );
      setCartProducts([...cart]);

      // limpiar flag
      setRemoving((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }, ANIM_MS + 20); // pequeño margen
  };

  const updateQuantity = (id, newQty) => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const i = cart.findIndex((it) => it.id === id);
    if (i >= 0) {
      cart[i].qty = Math.max(1, newQty);
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
    // Dispara un evento de storage para notificar a otros componentes
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cartItems',
        newValue: JSON.stringify(cart),
      }),
    );
    setCartProducts([...cart]);
  };

  const handleConfirmPurchase = () => {
    // Verificar stock de todos los productos
    const hasStock = cartProducts.every((p) => {
      const product = getProductById(p.id);
      return product && p.qty <= product.stock;
    });

    if (!hasStock) {
      alert('Algunos productos no tienen stock suficiente');
      return;
    }

    // Aquí iría la lógica de procesamiento de pago
    alert('¡Compra realizada con éxito!');
    localStorage.setItem('cartItems', '[]');
    // Dispara un evento de storage para notificar a otros componentes
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cartItems',
        newValue: '[]',
      }),
    );
    setCartProducts([]);
    setShowPopup(false);
  };

  return (
    <>
      <Header />
      <section className="cart-container">
        {/* Mostrar indicador de carga mientras se cargan los productos */}
        {loading && (
          <div className="loading-indicator" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando productos...</p>
          </div>
        )}

        <div className={'cart-message-box ' + (totalItems <= 0 ? 'show' : '')}>
          <div className="cart-message">
            <h2 className="title">Tu carrito de compras está vacío :c</h2>
            <p className="message">Agregá productos a tu carrito</p>
          </div>
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path
              fill="#000000"
              d="M16 64C7.2 64 0 71.2 0 80C0 88.8 7.2 96 16 96L61.3 96C69 96 75.7 101.5 77 109.1L127.9 388.8C134.1 423 163.9 447.9 198.7 447.9L464 448C472.8 448 480 440.8 480 432C480 423.2 472.8 416 464 416L198.7 416C179.4 416 162.8 402.2 159.3 383.2L153.6 352L466.6 352C500.5 352 529.9 328.3 537 295.1L569.4 144.4C574.8 119.5 555.8 96 530.3 96L106.6 96C99.9 77.1 81.9 64 61.3 64L16 64zM113 128L530.3 128C535.4 128 539.2 132.7 538.1 137.7L505.8 288.4C501.8 306.8 485.6 320 466.7 320L147.9 320L113 128zM188 524C188 513 197 504 208 504C219 504 228 513 228 524C228 535 219 544 208 544C197 544 188 535 188 524zM260 524C260 495.3 236.7 472 208 472C179.3 472 156 495.3 156 524C156 552.7 179.3 576 208 576C236.7 576 260 552.7 260 524zM432 504C443 504 452 513 452 524C452 535 443 544 432 544C421 544 412 535 412 524C412 513 421 504 432 504zM432 576C460.7 576 484 552.7 484 524C484 495.3 460.7 472 432 472C403.3 472 380 495.3 380 524C380 552.7 403.3 576 432 576z"
            />
          </svg>
        </div>

        <div className={'cart-box ' + (totalItems >= 1 ? 'show' : '')}>
          <div className="cart-message">
            <h2 className="title">Tu carrito de compras</h2>
          </div>

          <div className="cart-items">
            {cartProducts.map((p, index) => {
              const fullProduct = getProductById(p.id);
              const isRemoving = removing.has(p.id); // ✅ per-item

              // Si el producto no existe en la API, no lo mostramos
              if (!fullProduct) return null;

              return (
                <div
                  key={p.id} // ✅ mejor key estable
                  className={`cart-items-product ${isRemoving ? 'is-removing' : ''}`}
                >
                  <ProductCardAdded
                    product={fullProduct}
                    qty={p.qty || 1}
                    variant="cart"
                    onClick={() => removeOne(p.id)}
                    onQuantityChange={(newQty) => updateQuantity(p.id, newQty)}
                  />
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Resumen del Carrito</h3>
            {cartProducts.map((p) => {
              const fullProduct = getProductById(p.id);
              if (!fullProduct) return null;
              
              const finalPrice = hasDiscount(fullProduct)
                ? calculateDiscountedPrice(fullProduct)
                : fullProduct.price;
              const subtotal = finalPrice * (p.qty || 1);

              return (
                <div key={p.id} className="cart-summary-item">
                  <span>
                    {fullProduct.name || fullProduct.title} (x{p.qty || 1})
                  </span>
                  <span>
                    ${subtotal}
                    {hasDiscount(fullProduct) && ` (-${fullProduct.discount}%)`}
                  </span>
                </div>
              );
            })}

            <div className="cart-summary-total">
              <h3>Total</h3>
              <h3>${totalPrice}</h3>
            </div>

            <button
              className="confirm-purchase-btn"
              onClick={() => setShowPopup(true)}
            >
              Confirmar Compra
            </button>
          </div>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h3>Confirmar Compra</h3>
                <div className="purchase-details">
                  <p>
                    <strong>Resumen de tu compra:</strong>
                  </p>
                  {cartProducts.map((p, index) => {
                    const fullProduct = getProductById(p.id);
                    if (!fullProduct) return null;
                    
                    const finalPrice = hasDiscount(fullProduct)
                      ? calculateDiscountedPrice(fullProduct)
                      : fullProduct.price;
                    return (
                      <div key={index} className="purchase-item">
                        <span>{fullProduct.name || fullProduct.title}</span>
                        <span>x{p.qty}</span>
                        <span>${finalPrice * p.qty}</span>
                        {hasDiscount(fullProduct) && (
                          <span className="discount-indicator">
                            (-{fullProduct.discount}%)
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className="purchase-total">
                    <strong>Total a pagar: ${totalPrice}</strong>
                  </div>
                </div>
                <div className="popup-buttons">
                  <button
                    className="cancel-button"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="confirm-button"
                    onClick={handleConfirmPurchase}
                  >
                    Confirmar Compra
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Cart;
