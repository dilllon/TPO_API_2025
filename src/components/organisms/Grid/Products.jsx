import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import { useMemo } from "react";
import { getProductsGroupedByCategory } from "../../../constants/products";
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

function ProductsGrid({ onClick }) {
  // Separa por categoria y luego Ordena los productos de cada categoría
  const ordered = useMemo(
    () => {
      const categories = getProductsGroupedByCategory();
      return categories.map((cat) => ({
        ...cat,
        products: orderProducts(cat.products),
      }));
    },
    []
  );

  return (
    <>
      {ordered.map(({ categoryName, products }) => (
        <section key={categoryName} id={`category-${categoryName.toLowerCase()}`}>
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
