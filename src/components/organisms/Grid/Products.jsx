import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import { useMemo } from "react";
import "./Products.css";

// Ordena por título (ES-AR), devolviendo una COPIA
function orderProducts(products) {
  return [...products].sort((a, b) =>
    (a.title ?? "").localeCompare(b.title ?? "", "es-AR", {
      sensitivity: "base",
      numeric: true,
    })
  );
}

const categories = [
  {
    categoryName: "Electro",
    products: [
      { id: "cat1-0", title: "Mouse inalámbrico",   price:  2999,  image: "/src/assets/images/productos/52898-producto-logitech-g305-negro.jpg", stock: 10 },
      { id: "cat1-1", title: "Teclado mecánico",     price: 19999,  image: "...", stock: 10 },
      { id: "cat1-2", title: "Monitor 24 pulgadas",  price: 159999, image: "...", stock: 10 },
      { id: "cat1-3", title: "Laptop gamer",         price: 899999, image: "...", stock: 10 },
      { id: "cat1-4", title: "Smartphone 5G",        price: 499999, image: "...", stock: 10 },
    ],
  },
  {
    categoryName: "Cocina",
    products: [
      { id: "cat2-0", title: "Cargador portátil",    price:  9999,  image: "...", stock: 10 },
      { id: "cat2-1", title: "Smartwatch",           price:  79999, image: "...", stock: 10 },
      { id: "cat2-2", title: "Auriculares Bluetooth",price:  24999, image: "...", stock: 10 },
      { id: "cat2-3", title: "Tablet Android",       price: 199999, image: "...", stock: 10 },
    ],
  },
];

function ProductsGrid({ onClick }) {
  // Separa por categoria y luego Ordena los productos de cada categoría
  const ordered = useMemo(
    () =>
      categories.map((cat) => ({
        ...cat,
        products: orderProducts(cat.products),
      })),
    []
  );

  return (
    <>
      {ordered.map(({ categoryName, products }) => (
        <section key={categoryName}>
          <h2>{categoryName}</h2>
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                variant={categoryName}          // por si querés estilos/behaviour por categoría
                onClick={() => onClick(p)}      // agrega al carrito
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default ProductsGrid;
