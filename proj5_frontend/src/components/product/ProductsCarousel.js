import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import './ProductsCarousel.css'; 
import { FormattedMessage } from 'react-intl';

function ProductsCarousel({ products }) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
  if (carouselRef.current) {
    const itemWidth = 300 + 16; // 300px card + ~16px gap
    carouselRef.current.scrollBy({
      left: direction * itemWidth,
      behavior: 'smooth'
    });
  }
};


  if (!products || products.length === 0) return <p><FormattedMessage id="productsCarousel.notLoaded" defaultMessage="Nenhum produto adicionado recentemente."/></p>;

  return (
    <div className="products-carousel-wrapper">
      <button className="carousel-control prev" onClick={() => scrollCarousel(-1)}>&lt;</button>
      <div className="products-carousel">
        <div className="products-carousel-inner" ref={carouselRef}>
          {products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Ordena do mais recente
            .slice(0, 6) // Mostra até 6 produtos (2 páginas de 3)
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
      <button className="carousel-control next" onClick={() => scrollCarousel(1)}>&gt;</button>
    </div>
  );
}

export default ProductsCarousel;
