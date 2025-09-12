import { useMemo, useState } from "react";
import { useProducts } from "../../../context/ProductContext";
import CarouselProducts from "../../molecules/CarouselProducts/CarouselProducts";
import ProductCard from "../../molecules/ProductCard/ProductCard";
import { useUser } from "@/context/UserContext";
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

function ProductsGrid({ onAddToCart }) {
  const { productsData, getProductsGroupedByCategory, getProductsGroupedByDifferentOwner, calculateDiscountedPrice } = useProducts();
  const {userData, isAuthenticated} = useUser();
  const userId = userData?.id;
  const [filter, setFilter] = useState({});

  // Obtener todas las categorías
  const allCategories = useMemo(() => {
    return isAuthenticated ? getProductsGroupedByDifferentOwner(userId).map(cat => cat.categoryName) : getProductsGroupedByCategory().map(cat => cat.categoryName);
  }, [productsData, getProductsGroupedByCategory, isAuthenticated]);

  // Filtrar productos según el filtro
  const filteredCategories = useMemo(() => {
    let categories = isAuthenticated ? getProductsGroupedByDifferentOwner(userId) : getProductsGroupedByCategory();
    if (filter.category) {
      categories = categories.filter(cat => cat.categoryName === filter.category);
    }
    return categories.map(cat => ({
      ...cat,
      products: orderProducts(cat.products).filter(p => {
        const finalPrice = p.discount !== undefined ? calculateDiscountedPrice(p) : p.price;
        const priceOk = (filter.minPrice === undefined || finalPrice >= filter.minPrice) &&
          (filter.maxPrice === undefined || finalPrice <= filter.maxPrice);
        const stockOk = !filter.inStock || (p.stock && p.stock > 0);
        const discountOk = !filter.hasDiscount || (p.discount && p.discount > 0);
        return priceOk && stockOk && discountOk;
      })
    })).filter(cat => cat.products.length > 0);
  }, [productsData, filter]);

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
