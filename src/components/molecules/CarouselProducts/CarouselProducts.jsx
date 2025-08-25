// CarouselProducts.jsx
import useEmblaCarousel from "embla-carousel-react";
import "./CarouselProducts.css";

export default function CarouselProducts({ products, renderCard }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {products.map((p) => (
          <div className="embla__slide" key={p.id}>
            {renderCard(p)}
          </div>
        ))}
      </div>

      {/* <div className="embla__controls">
        <button onClick={() => emblaApi && emblaApi.scrollPrev()}>&larr;</button>
        <button onClick={() => emblaApi && emblaApi.scrollNext()}>&rarr;</button>
      </div> */}
    </div>
  );
}
