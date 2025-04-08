import React, { useRef } from 'react';
import CategoryCard from './CategoryCard';
import '../product/ProductsCarousel.css'; // Estilos para o carousel
import { FormattedMessage } from 'react-intl';

function CategoriesCarousel({ categories }) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth; // largura visível da área
      carouselRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <p>
        <FormattedMessage
          id="categoriesCarousel.notLoaded"
          defaultMessage="Nenhuma categoria disponível."
        />
      </p>
    );
  }

  return (
    <div className="products-carousel-wrapper">
      <button className="carousel-control prev" onClick={() => scrollCarousel(-1)}>&lt;</button>
      <div className="products-carousel">
        <div className="products-carousel-inner" ref={carouselRef}>
          {categories
            .sort((a, b) => a.name.localeCompare(b.name)) // ou qualquer outra lógica
            .map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
        </div>
      </div>
      <button className="carousel-control next" onClick={() => scrollCarousel(1)}>&gt;</button>
    </div>
  );
}

export default CategoriesCarousel;
