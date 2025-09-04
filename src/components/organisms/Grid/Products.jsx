import CarouselProducts from "@/components/molecules/CarouselProducts/CarouselProducts";
import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import { useEffect, useMemo } from "react";
import { useProducts } from "../../../hooks/useProducts";
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
  const { products, loading, error, loadProducts } = useProducts();
  
  // Escuchar eventos de actualización de productos
  useEffect(() => {
    const handleProductsUpdate = () => {
      loadProducts();
    };
    
    window.addEventListener('products-updated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('products-updated', handleProductsUpdate);
    };
  }, [loadProducts]);
  
  // Agrupar productos por categoría usando los datos de la API
  const ordered = useMemo(() => {
    if (!products.length) return [];
    
    // Agrupar por categoría
    const groupedByCategory = products.reduce((acc, product) => {
      const category = product.category || 'Sin categoría';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
    
    // Convertir a formato esperado y ordenar productos
    return Object.entries(groupedByCategory).map(([categoryName, categoryProducts]) => ({
      categoryName,
      products: orderProducts(categoryProducts),
    }));
  }, [products]);

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p>Error al cargar productos: {error}</p>
      </div>
    );
  }

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
                onClick={() => onAddToCart?.(p)}   // agrega al carrito si se pasó prop
              />
            )}
          />
        </section>
      ))}
    </>
  );
}

export default ProductsGrid;
