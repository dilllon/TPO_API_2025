import ProductCardAdded from '@/components/molecules/ProductCard/ProductCardAdded';
import { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';

function Cart() {
  const { getProductById, hasDiscount, calculateDiscountedPrice } = useProducts();
  const { products, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart, removing, isLoading } = useCart();
  const [showPopup, setShowPopup] = useState(false);


  const handleConfirmPurchase = () => {
    // Verificar stock de todos los productos
    const hasStock = products.every((p) => p.qty <= p.stock);

    if (!hasStock) {
      alert('Algunos productos no tienen stock suficiente');
      return;
    }

    // Aquí iría la lógica de procesamiento de pago
    alert('¡Compra realizada con éxito!');
    clearCart();
    setShowPopup(false);
  };

  if (isLoading) {
    return (
      <div className={styles["cart-container"]}>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <>
      <section className={styles["cart-container"]}>
        <div className={`${styles["cart-message-box"]} ${totalItems <= 0 ? styles.show : ''}`}>
          <div className={styles["cart-message"]}>
            <h2 className={styles.title}>Tu carrito de compras está vacío :c</h2>
            <p className={styles.message}>Agregá productos a tu carrito</p>
          </div>
          <svg
            className={styles["icon"]}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path
              fill="#000000"
              d="M16 64C7.2 64 0 71.2 0 80C0 88.8 7.2 96 16 96L61.3 96C69 96 75.7 101.5 77 109.1L127.9 388.8C134.1 423 163.9 447.9 198.7 447.9L464 448C472.8 448 480 440.8 480 432C480 423.2 472.8 416 464 416L198.7 416C179.4 416 162.8 402.2 159.3 383.2L153.6 352L466.6 352C500.5 352 529.9 328.3 537 295.1L569.4 144.4C574.8 119.5 555.8 96 530.3 96L106.6 96C99.9 77.1 81.9 64 61.3 64L16 64zM113 128L530.3 128C535.4 128 539.2 132.7 538.1 137.7L505.8 288.4C501.8 306.8 485.6 320 466.7 320L147.9 320L113 128zM188 524C188 513 197 504 208 504C219 504 228 513 228 524C228 535 219 544 208 544C197 544 188 535 188 524zM260 524C260 495.3 236.7 472 208 472C179.3 472 156 495.3 156 524C156 552.7 179.3 576 208 576C236.7 576 260 552.7 260 524zM432 504C443 504 452 513 452 524C452 535 443 544 432 544C421 544 412 535 412 524C412 513 421 504 432 504zM432 576C460.7 576 484 552.7 484 524C484 495.3 460.7 472 432 472C403.3 472 380 495.3 380 524C380 552.7 403.3 576 432 576z"
            />
          </svg>
        </div>

        <div className={`${styles["cart-box"]} ${totalItems >= 1 ? styles.show : ''}`}>
          <div className={styles["cart-message"]}>
            <h2 className={styles.title}>Tu carrito de compras</h2>
          </div>

          <div className={styles["cart-items"]}>
            {products.map((p) => {
              const fullProduct = getProductById(p.id);
              const isRemoving = removing.has(p.id);

              if (!fullProduct) return null;

              return (
                <div
                  key={`cart-item-${p.id}`}
                  className={`${styles["cart-items-product"]} ${isRemoving ? styles["is-removing"] : ''}`}
                >
                  <ProductCardAdded
                    product={fullProduct}
                    qty={p.qty || 1}
                    variant="cart"
                    onClick={() => removeFromCart(p.id)}
                    onQuantityChange={(newQty) => updateQuantity(p.id, newQty)}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles["cart-summary"]}>
            <h3>Resumen del Carrito</h3>
            {products.map((p) => {
              const fullProduct = getProductById(p.id);
              const finalPrice = hasDiscount(fullProduct)
                ? calculateDiscountedPrice(fullProduct)
                : fullProduct.price;
              const subtotal = finalPrice * (p.qty || 1);

              return (
                <div key={p.id} className={styles["cart-summary-item"]}>
                  <span>
                    {fullProduct.title} (x{p.qty || 1})
                  </span>
                  <span>
                    ${subtotal}
                    {hasDiscount(fullProduct) && ` (-${fullProduct.discount}%)`}
                  </span>
                </div>
              );
            })}

            <div className={styles["cart-summary-total"]}>
              <h3>Total</h3>
              <h3>${totalPrice}</h3>
            </div>

            <button
              className={styles["confirm-purchase-btn"]}
              onClick={() => setShowPopup(true)}
            >
              Confirmar Compra
            </button>
          </div>

          {showPopup && (
            <div className={styles["popup-overlay"]}>
              <div className={styles["popup-content"]}>
                <h3>Confirmar Compra</h3>
                <div className={styles["purchase-details"]}>
                  <p>
                    <strong>Resumen de tu compra:</strong>
                  </p>
                  {products.map((p, index) => {
                    const fullProduct = getProductById(p.id);
                    const finalPrice = hasDiscount(fullProduct)
                      ? calculateDiscountedPrice(fullProduct)
                      : p.price;
                    return (
                      <div key={index} className={styles["purchase-item"]}>
                        <span>{p.title}</span>
                        <span>x{p.qty}</span>
                        <span>${finalPrice * p.qty}</span>
                        {hasDiscount(fullProduct) && (
                          <span className={styles["discount-indicator"]}>
                            (-{fullProduct.discount}%)
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <div className={styles["purchase-total"]}>
                    <strong>Total a pagar: ${totalPrice}</strong>
                  </div>
                </div>
                <div className={styles["popup-buttons"]}>
                  <button
                    className={styles["cancel-button"]}
                    onClick={() => setShowPopup(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles["confirm-button"]}
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
