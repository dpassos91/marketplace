import React, { useEffect, useState } from 'react';
import Aside from '../components/Aside';
import ProductCard from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryComponents';
import * as productAPI from '../api/productAPI'; //
import { categoryAPI } from '../api/categoryAPI'; // Certifique-se de que está importando corretamente

console.log('Objeto categoryAPI:', categoryAPI);

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
        const categoriesData = await categoryAPI.getAllCategories(); // Usando categoryAPI corretamente
        setCategories(categoriesData);
        console.log('Categorias carregadas:', categoriesData); // Corrigido para mostrar o resultado correto
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []); // Certifique-se de que o array de dependências está vazio para evitar loops infinitos

  return (
    <>
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
    </>
  );
}

export default HomePage;
