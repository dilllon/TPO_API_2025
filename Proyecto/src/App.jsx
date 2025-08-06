import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Header from './Componentes/Header';
import ProductoCard from './Componentes/Product';

function App() {
  return (
    <>
      <Header />
      <main style={{ padding: '0rem' }}>
        <h2>¡Bienvenido a nuestra tienda!</h2>
        <p>Explorá nuestros productos y hacé tu compra de forma fácil y rápida.</p>
      </main>
      <h2>¡Bienvenido a nuestra tienda!</h2>
        <p>Explorá nuestros productos y hacé tu compra de forma fácil y rápida.</p>

        <h2>A</h2>
        <p>Explorá nuestros productos y hacé tu compra de forma fácil y rápida.</p>
        <button>BOTON1 <a href=""></a></button>
        <button>BOTON2 <a href=""></a></button>
        <h2>¡Bienvenido a nuestra tienda!</h2>
        <p>Explorá nuestros productos y hacé tu compra de forma fácil y rápida.</p>

        <h2>¡Bienvenido a nuestra tienda!</h2>
        <p>Explorá nuestros productos y hacé tu compra de forma fácil y rápida.</p>
        <h3>1</h3>
        <h3>2</h3>
        <h3>3</h3>
        <div className="productos-grid">
          <ProductoCard
          titulo="Mouse inalámbrico"
          precio={2999}
          imagen="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
          stock={0} />
                  <ProductoCard
          titulo="Mouse inalámbrico"
          precio={2999}
          imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
          stock={0} />
                  <ProductoCard
          titulo="Mouse inalámbrico"
          precio={2999}
          imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
          stock={0} />
                  <ProductoCard
          titulo="Mouse inalámbrico"
          precio={2999}
          imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
          stock={0} />
                  <ProductoCard
          titulo="Mouse inalámbrico"
          precio={2999}
          imagen="https://dummyimage.com/200x200/cccccc/000000.png&text=Producto"
          stock={0} />
        </div>
        
    </> 
  );
}


export default App
