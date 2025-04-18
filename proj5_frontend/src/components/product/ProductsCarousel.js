import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import './ProductsCarousel.css'; 
import { FormattedMessage } from 'react-intl';
import useMediaType from '../../hooks/useMediaType';
import { deviceStore } from '../../stores/deviceStore';

function ProductsCarousel({ products }) {
  const carouselRef = useRef(null);
  
  // Atualiza o deviceStore automaticamente
  useMediaType();
  const mediaType = deviceStore((state) => state.mediaType);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const itemWidth = 300 + 16; // 300px card + ~16px gap
      carouselRef.current.scrollBy({
        left: direction * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) {
    return (
      <p>
        <FormattedMessage
          id="productsCarousel.notLoaded"
          defaultMessage="Nenhum produto adicionado recentemente."
        />
      </p>
    );
  }

  return (
    <div className="products-carousel-wrapper">
      {/* ❌ Esconde os botões em mobile */}
      {!mediaType.isTabletOrMobile && (
        <button className="carousel-control prev" onClick={() => scrollCarousel(-1)}>&lt;</button>
      )}

      <div className="products-carousel">
        <div className="products-carousel-inner" ref={carouselRef}>
          {products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6)
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>

      {!mediaType.isTabletOrMobile && (
        <button className="carousel-control next" onClick={() => scrollCarousel(1)}>&gt;</button>
      )}
    </div>
  );
}

export default ProductsCarousel;

