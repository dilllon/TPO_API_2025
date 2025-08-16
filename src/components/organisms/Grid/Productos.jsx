import ProductoCard from "@/components/molecules/ProductCard/ProductCard";
import "./Productos.css";

function ProductosGrid({onClick}) {
  const productoscat1 = [
    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    },
    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    },
    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    },    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    },    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    }
  ];




  const productoscat2 = [
    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    },
    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    },
    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    },    {
      titulo: "Mouse inalámbrico",
      precio: 2999,
      imagen: "https://dummyimage.com/200x200/cccccc/000000.png&text=Producto",
      stock: 0
    }
  ];

 return (
  <>
    {/* Primer bloque */}
    <h2>Categoria 1</h2>
    <div className="productos-grid">
      {productoscat1.map((p, i) => (
        <ProductoCard
          key={`cat1-${i}`}
          {...p}
          onClick={onClick}
          variant="cat1"
        />
      ))}
    </div>
    <h2>Categoria 2</h2>
    {/* Segundo bloque */}
    <div className="productos-grid">
      {productoscat2.map((p, i) => (
        <ProductoCard
          key={`cat2-${i}`}
          {...p}
          onClick={onClick}
          variant="cat2"
        />
      ))}
    </div>
  </>
);
}

export default ProductosGrid;
