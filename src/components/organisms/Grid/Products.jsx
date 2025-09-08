import { useMemo, useState } from "react";
import { useProducts } from "../../../context/ProductContext";
import CarouselProducts from "../../molecules/CarouselProducts/CarouselProducts";
import ProductCard from "../../molecules/ProductCard/ProductCard";
import Filter from "../Filter/Filter";
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


function ProductsGrid({ onAddToCart, search = "" }) {
  const { getProductsGroupedByCategory } = useProducts();
  const [filter, setFilter] = useState({});

  // Obtener todas las categorías
  const allCategories = useMemo(() => {
    return getProductsGroupedByCategory().map(cat => cat.categoryName);
  }, [getProductsGroupedByCategory]);

  // Filtrar productos según el filtro y búsqueda
  const filteredCategories = useMemo(() => {
    let categories = getProductsGroupedByCategory();
    if (filter.category) {
      categories = categories.filter(cat => cat.categoryName === filter.category);
    }
    return categories.map(cat => ({
      ...cat,
      products: orderProducts(cat.products).filter(p => {
        const priceOk = (filter.minPrice === undefined || p.price >= filter.minPrice) &&
          (filter.maxPrice === undefined || p.price <= filter.maxPrice);
        const stockOk = !filter.inStock || (p.stock && p.stock > 0);
        const discountOk = !filter.hasDiscount || (p.discount && p.discount > 0);
        const searchOk = !search || (p.title && p.title.toLowerCase().includes(search.toLowerCase()));
        return priceOk && stockOk && discountOk && searchOk;
      })
    })).filter(cat => cat.products.length > 0);
  }, [getProductsGroupedByCategory, filter, search]);

  return (
    <>
      <Filter categories={allCategories} onFilter={setFilter} />
      {filteredCategories.map(({ categoryName, products }) => (
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
                variant={categoryName}
                onClick={() => onAddToCart(p)}
              />
            )}
          />
        </section>
      ))}
    </>
  );
}

export default ProductsGrid;
