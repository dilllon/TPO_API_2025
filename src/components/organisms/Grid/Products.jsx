import { useMemo } from "react";
import { useProducts } from "../../../context/ProductContext";
import CarouselProducts from "../../molecules/CarouselProducts/CarouselProducts";
import ProductCard from "../../molecules/ProductCard/ProductCard";
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

function ProductsGrid({ onAddToCart }) {
  const { productsData, getProductsGroupedByCategory } = useProducts();
  // Separa por categoría y ordena los productos de cada categoría
  const ordered = useMemo(() => {
    const categories = getProductsGroupedByCategory();
    return categories.map((cat) => ({
      ...cat,
      products: orderProducts(cat.products),
    }));
  }, [productsData, getProductsGroupedByCategory]); // Agregamos las dependencias correctas

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
                onClick={() => onAddToCart(p)}   // agrega al carrito si se pasó prop
              />
            )}
          />
        </section>
      ))}
    </>
  );
}

export default ProductsGrid;
