import { useState } from 'react';
import './Carrousel.css';

const imagenes = [
  '/foto1.png',
  '/foto2.jpg'
];


function Carrousel() {
  const [indice, setIndice] = useState(0);

  const siguiente = () => {
    setIndice((indice + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndice((indice - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="carrousel">
      <button className="boton-carrousel" onClick={anterior}>&lt;</button>
      <img src={imagenes[indice]} alt={`Imagen ${indice + 1}`} className="imagen-carrousel" />
      <button className="boton-carrousel" onClick={siguiente}>&gt;</button>
    </div>
  );
}

export default Carrousel;
