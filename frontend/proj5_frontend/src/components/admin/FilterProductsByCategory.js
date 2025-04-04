import React, { useState, useEffect } from 'react';
import Modal from '../commons/Modal';
import EditProductModal from '../commons/EditProductModal';
import { apiConfig } from '../../api/apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

function FilterProductsByCategory({ isOpen, onClose }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const data = await apiCall(API_ENDPOINTS.categories.all);
          setCategories(data);
        } catch (error) {
          console.error('Erro ao carregar categorias:', error);
        }
      };

      fetchCategories();
    }
  }, [isOpen]);

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    if (categoryId) {
      try {
        const data = await apiCall(API_ENDPOINTS.products.byCategory(categoryId));
        // Filtrar produtos que não têm status = 2
        const availableProducts = data.filter((product) => product.status !== 2);
        setProducts(availableProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    }
  };

  const handleSuspendProduct = async (productId) => {
    if (window.confirm(`Tem certeza de que deseja suspender o produto com ID ${productId}?`)) {
      try {
        await apiCall(API_ENDPOINTS.products.deactivate(productId));
        alert(`Produto ${productId} foi suspenso com sucesso.`);
        
        // Atualiza a lista de produtos
        const data = await apiCall(API_ENDPOINTS.products.byCategory(selectedCategory));
        const availableProducts = data.filter((product) => product.status !== 4);
        setProducts(availableProducts);
      } catch (error) {
        console.error('Erro ao suspender produto:', error);
        alert('Erro ao suspender o produto. Tente novamente.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtrar por Categoria">
      <div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.price}€</td>
                  <td style={{ textAlign: 'center' }}>
                    {/* Botão Suspender */}
                    <button
                      className="btn-card tabela-btn btn-info"
                      onClick={() => handleSuspendProduct(product.id)}
                    >
                      Suspender
                    </button>

                    {/* Botão Editar */}
                    <button
                      className="btn-card tabela-btn btn-edit"
                      onClick={() => setProductToEdit(product)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Edição */}
      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          onClose={() => setProductToEdit(null)}
          onSave={(updatedProduct) => {
            // Atualiza a lista de produtos após edição
            setProducts((prevProducts) =>
              prevProducts.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p
              )
            );
          }}
        />
      )}
    </Modal>
  );
}

export default FilterProductsByCategory;




