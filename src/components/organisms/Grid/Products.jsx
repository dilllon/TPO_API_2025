import ProductCard from "@/components/molecules/ProductCard/ProductCard";
import "./Products.css";

function ProductsGrid({ onClick }) {
  const productsCat1 = [
    { id: 'cat1-0', title: "Mouse inalámbrico", price: 2999, image: "...", stock: 10 },
    { id: 'cat1-1', title: "Teclado mecánico", price: 19999, image: "...", stock: 10 },
    { id: 'cat1-2', title: "Monitor 24 pulgadas", price: 159999, image: "...", stock: 10 },
    { id: 'cat1-3', title: "Laptop gamer", price: 899999, image: "...", stock: 10 },
    { id: 'cat1-4', title: "Smartphone 5G", price: 499999, image: "...", stock: 10 },
  ];

  const productsCat2 = [
    { id: 'cat2-0', title: "Cargador portátil", price: 9999, image: "...", stock: 10 },
    { id: 'cat2-1', title: "Smartwatch", price: 79999, image: "...", stock: 10 },
    { id: 'cat2-2', title: "Auriculares Bluetooth", price: 24999, image: "...", stock: 10 },
    { id: 'cat2-3', title: "Tablet Android", price: 199999, image: "...", stock: 10 },
  ];

  return (
    <>
      <h2>Categoria 1</h2>
      <div className="products-grid">
        {productsCat1.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            // 👇 cuando tocan “Agregar”
            onClick={() => onClick(p)}
            variant="cat1"
          />
        ))}
      </div>

      <h2>Categoria 2</h2>
      <div className="products-grid">
        {productsCat2.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            onClick={() => onClick(p)}
            variant="cat2"
          />
        ))}
      </div>
    </>
  );
}

export default ProductsGrid;
