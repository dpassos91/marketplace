import React, { useEffect } from 'react';
import Aside from '../components/Aside';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { fetchRecentProducts, fetchCategories } from '../api';

function HomePage() {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    const loadData = async () => {
      const recentProducts = await fetchRecentProducts();
      const categoriesData = await fetchCategories();
      setProducts(recentProducts);
      setCategories(categoriesData);
    };
    loadData();
  }, []);

  return (
    <main className="main-container">
      <Aside />
      
      <div className="main-card-container">
        <h1>Últimos produtos adicionados</h1>
        <section className="card-container recent-products">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        <h1>Categorias disponíveis</h1>
        <section className="card-container categories-container">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </section>
      </div>
    </main>
  );
}

export default HomePage;
