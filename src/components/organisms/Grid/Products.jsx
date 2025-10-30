import { useCallback, useEffect, useMemo, useState } from "react";
import { useProducts } from "../../../context/ProductContext";
import CarouselProducts from "../../molecules/CarouselProducts/CarouselProducts";
import ProductCard from "../../molecules/ProductCard/ProductCard";
import { useUser } from "@/context/UserContext";
import Filter from "../Filter/Filter";
import "./Products.css";
import { useSearch } from "../../../context/SearchContext";

const DEFAULT_FILTER = {
  category: "",
  minPrice: undefined,
  maxPrice: undefined,
  inStock: false,
  hasDiscount: false,
};

// Ordena por titulo (locale ES-AR), devolviendo una copia
function orderProducts(products) {
  return [...products].sort((a, b) =>
    (a.title ?? "").localeCompare(b.title ?? "", "es-AR", {
      sensitivity: "base",
      numeric: true,
    })
  );
}

function ProductsGrid({ onAddToCart }) {
  const {
    productsData,
    isLoading,
    error,
    searchProducts,
    getCategoryNames,
  } = useProducts();
  const { userData, isAuthenticated } = useUser();
  const userId = userData?.id;
  const { searchTerm } = useSearch();

  const [activeFilter, setActiveFilter] = useState(DEFAULT_FILTER);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterError, setFilterError] = useState(null);

  const categories = useMemo(() => getCategoryNames(), [getCategoryNames]);

  const handleFilterChange = useCallback((newFilter) => {
    const normalizeNumber = (value) =>
      typeof value === "number" && !Number.isNaN(value) ? value : undefined;

    setActiveFilter({
      category: newFilter?.category ?? "",
      minPrice: normalizeNumber(newFilter?.minPrice),
      maxPrice: normalizeNumber(newFilter?.maxPrice),
      inStock: Boolean(newFilter?.inStock),
      hasDiscount: Boolean(newFilter?.hasDiscount),
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setActiveFilter(DEFAULT_FILTER);
  }, []);

  const trimmedSearchTerm = useMemo(() => searchTerm.trim(), [searchTerm]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(trimmedSearchTerm) ||
      (activeFilter.category && activeFilter.category !== "") ||
      activeFilter.minPrice !== undefined ||
      activeFilter.maxPrice !== undefined ||
      activeFilter.inStock ||
      activeFilter.hasDiscount;
  }, [activeFilter, trimmedSearchTerm]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!hasActiveFilters) {
      setFilterError(null);
      setIsFiltering(false);
      setDisplayProducts(productsData);
      return;
    }

    const controller = new AbortController();

    const fetchFilteredProducts = async () => {
      setIsFiltering(true);
      try {
        const result = await searchProducts(
          {
            title: trimmedSearchTerm || undefined,
            category: activeFilter.category || undefined,
            minPrice: activeFilter.minPrice,
            maxPrice: activeFilter.maxPrice,
            hasStock: activeFilter.inStock ? true : undefined,
            hasDiscount: activeFilter.hasDiscount ? true : undefined,
          },
          controller.signal
        );

        setDisplayProducts(result);
        setFilterError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error("Error al aplicar filtros:", err);
        setFilterError(err.message || "Error al aplicar los filtros");
        setDisplayProducts([]);
      } finally {
        setIsFiltering(false);
      }
    };

    fetchFilteredProducts();

    return () => controller.abort();
  }, [
    activeFilter,
    hasActiveFilters,
    isLoading,
    productsData,
    searchProducts,
    trimmedSearchTerm,
  ]);

  const groupedProducts = useMemo(() => {
    const groups = new Map();

    displayProducts.forEach((product) => {
      if (isAuthenticated && userId && product?.userId === userId) {
        return;
      }

      const categoryName = product?.category ?? "Otros";
      if (!groups.has(categoryName)) {
        groups.set(categoryName, []);
      }
      groups.get(categoryName).push(product);
    });

    return Array.from(groups.entries())
      .map(([categoryName, products]) => ({
        categoryName,
        products: orderProducts(products),
      }))
      .filter(({ products }) => products.length > 0);
  }, [displayProducts, isAuthenticated, userId]);

  const showLoading = isLoading || isFiltering;
  const showError = showLoading ? null : (filterError ?? error);

  return (
    <div className="container-products">
      <aside>
        <Filter
          categories={categories}
          onFilter={handleFilterChange}
          onReset={handleResetFilters}
        />
      </aside>
      <div>
        {showLoading && (
          <div className="loading">Cargando productos...</div>
        )}

        {!showLoading && showError && (
          <div className="error-message">{showError}</div>
        )}

        {!showLoading && !showError && groupedProducts.length === 0 && (
          <div className="empty-state">
            No se encontraron productos para los filtros seleccionados.
          </div>
        )}

        {!showLoading && !showError &&
          groupedProducts.map(({ categoryName, products }) => {
            const slug = (categoryName ?? "otros")
              .toLowerCase()
              .replace(/\s+/g, "-");
            const sectionKey = categoryName ?? slug;
            const sectionId = "category-" + slug;

            return (
              <section
                key={sectionKey}
                id={sectionId}
                className="products-section"
              >
                <h2>{categoryName}</h2>
                <CarouselProducts
                  products={products}
                  renderCard={(product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={categoryName}
                      onClick={() => onAddToCart(product)}
                    />
                  )}
                />
              </section>
            );
          })}
      </div>
    </div>
  );
}

export default ProductsGrid;
