import { useState } from 'react';
import ProductoCard from '@/components/molecules/ProductCard/ProductCard';
import './Productos.css';

function ProductosGrid() {
  return (
    <div className="productos-grid container-fluid">
        <div className="row align-content-center">
            <div className="col-12 col-md-6 col-xl-4 d-flex justify-content-center">
                <ProductoCard
                    titulo="Mouse inalámbrico"
                    precio={2999}
                    imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
                    stock={0}
                />
            </div>
            <div className="col-12 col-md-6 col-xl-4 d-flex justify-content-center">
                <ProductoCard
                    titulo="Mouse inalámbrico"
                    precio={2999}
                    imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
                    stock={0}
                />
            </div>
            <div className="col-12 col-md-6 col-xl-4 d-flex justify-content-center">
                <ProductoCard
                    titulo="Mouse inalámbrico"
                    precio={2999}
                    imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
                    stock={0}
                />
            </div>
        </div>
    </div>
  );
}

export default ProductosGrid;
