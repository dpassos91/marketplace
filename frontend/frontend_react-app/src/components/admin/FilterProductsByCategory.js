import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../commons/Modal';
import { apiConfig } from '../../api/apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

function FilterProductsByCategory({ isOpen, onClose, onFilter }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);

  // Carrega as categorias quando o modal é aberto
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await apiCall(API_ENDPOINTS.categories.all);
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          console.warn('Nenhuma categoria encontrada.');
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    if (isOpen) {
      loadCategories();
      setSelectedCategory(''); // Reseta a seleção quando o modal é aberto
      setProducts([]); // Limpa os produtos exibidos
    }
  }, [isOpen]);

  const handleCategoryChange = useCallback(async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      try {
        const productsData = await apiCall(API_ENDPOINTS.products.byCategory(categoryId));
        setProducts(productsData);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    } else {
      setProducts([]); // Limpa os produtos se nenhuma categoria for selecionada
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtrar por Categoria">
      <div>
        <select
          id="productCategorySelect"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {products.length > 0 ? (
          <table className="products-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Título</th>
                <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Preço</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.title}</td>
                  <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.price}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedCategory && <p style={{ textAlign: 'center' }}>Nenhum produto encontrado nesta categoria.</p>
        )}
      </div>
    </Modal>
  );
}

export default FilterProductsByCategory;

