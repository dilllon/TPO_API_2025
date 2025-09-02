import { useState } from 'react';
import './Carrousel.css';
import foto1 from '../../../assets/images/carrousel/foto1.png';
import foto2 from '../../../assets/images/carrousel/foto2.jpg';

const imagenes = [foto1, foto2];

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
      <button className="boton-carrousel" onClick={anterior}>
        &lt;
      </button>
      <img
        src={imagenes[indice]}
        alt={`Imagen ${indice + 1}`}
        className="imagen-carrousel"
      />
      <button className="boton-carrousel" onClick={siguiente}>
        &gt;
      </button>
    </div>
  );
}

export default Carrousel;
