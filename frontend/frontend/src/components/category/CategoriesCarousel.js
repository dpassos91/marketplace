// CategoriesCarousel.js
import React, { useState, useEffect, useRef } from 'react';
import CategoryCard from './CategoryCard';
import { categoryAPI } from '../api/categoryAPI';

function CategoriesCarousel() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error displaying categories:', err);
        setError('Erro ao carregar categorias.');
      }
    };

    fetchCategories();
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction * 300,
        behavior: 'smooth'
      });
    }
  };

  if (error) return <p>{error}</p>;
  if (categories.length === 0) return <p>Nenhuma categoria disponível.</p>;

  return (
    <div className="categories-carousel-wrapper">
      <button className="carousel-control prev" onClick={() => scrollCarousel(-1)}>&lt;</button>
      <div className="categories-carousel">
        <div className="categories-carousel-inner" ref={carouselRef}>
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
      <button className="carousel-control next" onClick={() => scrollCarousel(1)}>&gt;</button>
    </div>
  );
}

export default CategoriesCarousel;
