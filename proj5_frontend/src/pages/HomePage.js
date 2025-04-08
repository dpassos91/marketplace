import React, { useEffect, useState } from 'react';
import Aside from '../components/commons/Aside';
import CategoryCard from '../components/category/CategoryCard';
import ProductsCarousel from '../components/product/ProductsCarousel'; // Novo componente
import { productAPI } from '../api/productAPI';
import { categoryAPI } from '../api/categoryAPI';
import { FormattedMessage } from 'react-intl'; // Importar FormattedMessage
import '../components/product/ProductsCarousel.css'; // Estilos para o carousel
import CategoriesCarousel from '../components/category/CategoriesCarousel';

function HomePage() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await productAPI.getAllActiveProducts();
        setRecentProducts(productsData);

        const categoriesData = await categoryAPI.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <main className="main-container">
        <Aside />
        <div className="main-card-container">
          <h1>
            <FormattedMessage id="homePage.recentProducts" defaultMessage="Últimos produtos adicionados" />
          </h1>
          <ProductsCarousel products={recentProducts} />
          <h1>
            <FormattedMessage id="homePage.categories" defaultMessage="Categorias disponíveis" />
          </h1>
          <CategoriesCarousel categories={categories} />
          <section className="card-container categories-container">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

export default HomePage;


