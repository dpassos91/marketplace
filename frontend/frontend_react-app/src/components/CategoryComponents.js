import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as categoryAPI from '../api/categoryAPI';

// Componente de Card de Categoria
function CategoryCard({ category }) {
  const navigate = useNavigate();
  const imageUrl = category.imageUrl || 'https://ps.w.org/gazchaps-woocommerce-auto-category-product-thumbnails/assets/icon-256x256.png?rev=1848416';

  return (
    <div className="card category-card">
      <img src={imageUrl} alt={category.name} />
      <div>
        <h1>{category.name}</h1>
        <p>{category.description || 'Explore produtos desta categoria'}</p>
        <button 
          type="button" 
          title="Ver produtos"
          onClick={() => navigate(`/produtos?category=${category.id}`)}
        >
          Ver produtos
        </button>
      </div>
    </div>
  );
}

// Componente de Carrossel de Categorias
export function CategoriesCarousel() {
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

// Hook para filtrar produtos por categoria
export function useProductsByCategory(products, categoryId) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const filterProducts = async () => {
      try {
        const categoryData = await categoryAPI.getCategoryById(categoryId);
        setCategory(categoryData);

        const filtered = products.filter(
          product => String(product.categoryId) === String(categoryId)
        );
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Error filtering products by category:', err);
        setError('Erro ao carregar produtos desta categoria.');
      }
    };

    if (categoryId) {
      filterProducts();
    } else {
      setFilteredProducts(products);
    }
  }, [products, categoryId]);

  return { filteredProducts, category, error };
}

// Componente de Lista de Produtos
export function ProductList({ products, categoryId }) {
  const { filteredProducts, category, error } = useProductsByCategory(products, categoryId);

  if (error) return <p className="error-message">{error}</p>;
  if (filteredProducts.length === 0) return <p className="no-products-message">Nenhum produto disponível nesta categoria.</p>;

  return (
    <div className="product-list">
      {category && <h1 id="page-title">Produtos - {category.name}</h1>}
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Nota: Você precisará criar um componente ProductCard separadamente
function ProductCard({ product }) {
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/150';
  
  return (
    <div className="card product-card">
      <img src={imageUrl} alt={product.name} />
      <div>
        <h2>{product.name}</h2>
        <p>{product.description || 'Descrição não disponível'}</p>
        <p>Preço: {product.price ? `${product.price}€` : 'N/A'}</p>
        <button type="button" title="Ver detalhes">
          Ver detalhes
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
