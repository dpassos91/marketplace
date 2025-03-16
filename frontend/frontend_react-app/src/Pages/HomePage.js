import React, { useEffect, useState } from 'react';
import Aside from '../components/Aside';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import * as productAPI from '../api/productAPI'; //
import { categoryAPI } from '../api/categoryAPI';


function HomePage() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Buscar os últimos produtos adicionados
        const productsData = await productAPI.getAllProducts();
        setRecentProducts(productsData);

        // Buscar as categorias disponíveis
        const categoriesData = await categoryAPI.fetchAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <Header />
      <main className="main-container">
        <Aside />
        <div className="main-card-container">
          <h1>Últimos produtos adicionados</h1>
          <section className="card-container recent-products">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
          
          <h1>Categorias disponíveis</h1>
          <section className="card-container categories-container">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default HomePage;

