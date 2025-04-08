import React, { useState, useCallback } from 'react';
import Modal from '../commons/Modal';
import EditProductModal from './EditProductModal';
import { apiConfig } from '../../api/apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

function FilterProductsBySeller({ isOpen, onClose }) {
  const [sellerId, setSellerId] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [productToEdit, setProductToEdit] = useState(null);

  const searchSellerProducts = useCallback(async () => {
    if (!sellerId.trim()) {
      setMessage('Por favor, insira um ID de vendedor válido.');
      return;
    }

    try {
      const data = await apiCall(API_ENDPOINTS.products.bySeller(sellerId));
      // Filtrar produtos que não têm status = 2
      const availableProducts = data.filter((product) => product.status !== 4);
      if (availableProducts.length === 0) {
        setMessage(`Nenhum produto disponível para o vendedor ${sellerId}.`);
      } else {
        setMessage('');
        setProducts(availableProducts);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setMessage('Erro ao buscar produtos. Tente novamente.');
    }
  }, [sellerId]);

  const handleSuspendProduct = async (productId) => {
    if (window.confirm(`Tem certeza de que deseja suspender o produto com ID ${productId}?`)) {
      try {
        await apiCall(API_ENDPOINTS.products.deactivate(productId));
        alert(`Produto ${productId} foi suspenso com sucesso.`);
        
        // Atualiza a lista de produtos
        searchSellerProducts();
      } catch (error) {
        console.error('Erro ao suspender produto:', error);
        alert('Erro ao suspender o produto. Tente novamente.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtrar por Vendedor">
      <div>
        <input
          type="text"
          placeholder="Insira o ID do vendedor"
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px', width: '100%' }}
        />
        <button onClick={searchSellerProducts} style={{ padding: '8px', marginBottom: '10px' }}>
          Procurar produtos
        </button>

        {message && <p>{message}</p>}
        
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

export default FilterProductsBySeller;


