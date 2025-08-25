import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import { useMemo } from "react";
import { getProductsGroupedByCategory } from "../../../constants/products";
import "./Products.css";
import CarouselProducts from "@/components/molecules/CarouselProducts/CarouselProducts";

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
  // Separa por categoría y ordena los productos de cada categoría
  const ordered = useMemo(() => {
    const categories = getProductsGroupedByCategory();
    return categories.map((cat) => ({
      ...cat,
      products: orderProducts(cat.products),
    }));
  }, []);

  return (
    <>
      {ordered.map(({ categoryName, products }) => (
        <section
          key={categoryName}
          id={`category-${categoryName.toLowerCase()}`}
          className="products-section"
        >
          <h2>{categoryName}</h2>

          <CarouselProducts
            products={products}
            renderCard={(p) => (
              <ProductCard
                key={p.id}
                product={p}
                variant={categoryName}         // por si querés estilos por categoría
                onClick={() => onClick?.(p)}   // agrega al carrito si se pasó prop
              />
            )}
          />
        </section>
      ))}
    </>
  );
}

export default ProductsGrid;
