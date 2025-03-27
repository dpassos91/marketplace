import React, { useState, useCallback } from 'react';
import Modal from '../commons/Modal';
import { apiConfig } from '../../api/apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

function FilterProductsBySeller({ isOpen, onClose }) {
  const [sellerId, setSellerId] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  const searchSellerProducts = useCallback(async () => {
    if (!sellerId.trim()) {
      setMessage('Por favor, insira um ID de vendedor válido.');
      setProducts([]);
      return;
    }

    try {
      const productsData = await apiCall(API_ENDPOINTS.products.bySeller(sellerId));
      if (productsData === null || productsData.length === 0) {
        if (productsData === null) {
          setMessage(`O utilizador com ID ${sellerId} não existe.`);
        } else {
          setMessage(`O vendedor com ID ${sellerId} não tem produtos disponíveis.`);
        }
        setProducts([]);
      } else {
        setMessage('');
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos do vendedor:', error);
      setMessage('Erro ao buscar produtos. Por favor, tente novamente.');
      setProducts([]);
    }
  }, [sellerId]);

  const createProductTable = (products) => {
    const table = (
      <table className="products-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Título</th>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Preço</th>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Categoria</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.title}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.price}€</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.categoryName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    return table;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtrar por Vendedor">
      <div>
        <input
          type="text"
          id="sellerIdInput"
          placeholder="Insira o ID do vendedor"
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          style={{ marginBottom: '10px', marginRight: '10px', padding: '8px' }}
        />
        <button onClick={searchSellerProducts} style={{ padding: '8px 12px' }}>Buscar Produtos</button>
        {message && <p style={{ textAlign: 'center', color: message.includes('não existe') ? 'red' : 'inherit' }}>{message}</p>}
        {products.length > 0 && createProductTable(products)}
      </div>
    </Modal>
  );
}

export default FilterProductsBySeller;

