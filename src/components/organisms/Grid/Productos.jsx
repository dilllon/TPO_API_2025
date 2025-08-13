import React from "react";
import ProductoCard from "@/components/molecules/ProductCard/ProductCard";
import "./Productos.css";

function ProductosGrid() {
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
          titulo={p.titulo}
          precio={p.precio}
          imagen={p.imagen}
          stock={p.stock}
        />
      ))}
    </div>
    <h2>Categoria 2</h2>
    {/* Segundo bloque */}
    <div className="productos-grid">
      {productoscat2.map((p, i) => (
        <ProductoCard
          key={`cat2-${i}`}
          titulo={p.titulo}
          precio={p.precio}
          imagen={p.imagen}
          stock={p.stock}
        />
      ))}
    </div>
  </>
);
}

export default ProductosGrid;
