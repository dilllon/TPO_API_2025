import ProductoCard from "@/components/molecules/ProductCard/ProductCard";
import "./Productos.css";

function ProductosGrid({ onClick }) {
  const productoscat1 = [
    { id: 'cat1-0', titulo: "Mouse inalámbrico", precio: 2999, imagen: "...", stock: 10 },
    { id: 'cat1-1', titulo: "Teclado mecánico", precio: 19999, imagen: "...", stock: 10 },
    { id: 'cat1-2', titulo: "Monitor 24 pulgadas", precio: 159999, imagen: "...", stock: 10 },
    { id: 'cat1-3', titulo: "Laptop gamer", precio: 899999, imagen: "...", stock: 10 },
    { id: 'cat1-4', titulo: "Smartphone 5G", precio: 499999, imagen: "...", stock: 10 },
  ];

  const productoscat2 = [
    { id: 'cat2-0', titulo: "Cargador portátil", precio: 9999, imagen: "...", stock: 10 },
    { id: 'cat2-1', titulo: "Smartwatch", precio: 79999, imagen: "...", stock: 10 },
    { id: 'cat2-2', titulo: "Auriculares Bluetooth", precio: 24999, imagen: "...", stock: 10 },
    { id: 'cat2-3', titulo: "Tablet Android", precio: 199999, imagen: "...", stock: 10 },
  ];

  return (
    <>
      <h2>Categoria 1</h2>
      <div className="productos-grid">
        {productoscat1.map((p) => (
          <ProductoCard
            key={p.id}
            {...p}
            // 👇 cuando tocan “Agregar”
            onClick={() => onClick(p)}
            variant="cat1"
          />
        ))}
      </div>

      <h2>Categoria 2</h2>
      <div className="productos-grid">
        {productoscat2.map((p) => (
          <ProductoCard
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

export default ProductosGrid;
