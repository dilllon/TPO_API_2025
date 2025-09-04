// CarouselProducts.jsx
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CarouselProducts.css";

export default function CarouselProducts({ products, renderCard }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    skipSnaps: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Función más simple para determinar si mostrar controles
  const shouldShowControls = useCallback(() => {
    // Siempre mostrar si hay más de 1 producto y dejar que los estados disabled manejen la visibilidad
    return products.length > 1;
  }, [products.length]);

  const updateControlsVisibility = useCallback(() => {
    if (!emblaApi) return;
    
    // Verificar si realmente se puede hacer scroll
    const canPrev = emblaApi.canScrollPrev();
    const canNext = emblaApi.canScrollNext();
    
    // Solo mostrar controles si se puede hacer scroll en alguna dirección
    setShowControls(canPrev || canNext);
    
    console.log('Controls visibility:', {
      productsLength: products.length,
      canPrev,
      canNext,
      showControls: canPrev || canNext
    });
  }, [emblaApi, products.length]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    // Pequeño delay para asegurar que el carousel esté completamente inicializado
    const timeoutId = setTimeout(() => {
      onSelect();
      updateControlsVisibility();
    }, 100);
    
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", updateControlsVisibility);
    emblaApi.on("resize", updateControlsVisibility);

    return () => {
      clearTimeout(timeoutId);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("reInit", updateControlsVisibility);
      emblaApi.off("resize", updateControlsVisibility);
    };
  }, [emblaApi, onSelect, updateControlsVisibility]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {products.map((p) => (
            <div className="embla__slide" key={p.id}>
              {renderCard(p)}
            </div>
          ))}
        </div>
      </div>

      {/* Mostrar controles solo si es necesario hacer scroll */}
      {showControls && (
        <div className="embla__controls">
          <button 
            className={`embla__button embla__button--prev ${!canScrollPrev ? 'embla__button--disabled' : ''}`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Producto anterior"
          >
            <FaChevronLeft />
          </button>
          <button 
            className={`embla__button embla__button--next ${!canScrollNext ? 'embla__button--disabled' : ''}`}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Siguiente producto"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
