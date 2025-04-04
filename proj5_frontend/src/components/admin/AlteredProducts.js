import React, { useState, useEffect } from 'react';
import { apiConfig } from '../../api/apiConfig';

const PRODUCTS_PER_PAGE = 10; // Número de produtos por página

const { apiCall, API_ENDPOINTS } = apiConfig;

function AlteredProducts() {
  const [id, setid] = useState('');
  const [allProducts, setAllProducts] = useState([]); // Estado para todos os produtos
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [message, setMessage] = useState(''); // Mensagem de erro ou sucesso

  // Função para carregar os produtos alterados
  const loadProductsAlterados = async () => {
    try {
      console.log('Carregando produtos...');
      // Chama a função para obter os produtos alterados
      const productsData = await apiCall(API_ENDPOINTS.products.update(id)) // Substituir por sua função real
      console.log('Produtos obtidos:', productsData);
      
      if (!Array.isArray(productsData)) {
        throw new Error('Formato de dados inesperado');
      }
      setAllProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setMessage('Erro ao carregar produtos. Tente novamente.');
    }
  };

  // Função para obter os produtos para a página atual
  const getProductsForPage = (page) => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return allProducts.slice(startIndex, endIndex);
  };

  // Função para exibir a tabela de produtos alterados
  const displayProductsTable = (products) => {
    return (
      <table className="products-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Nome</th>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Preço</th>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>ID Produto</th>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Username</th>
            <th style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f2f2f2' }}>Data de Alteração</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.title}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.price}€</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.id}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.sellerUsername}</td>
              <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>{product.editDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Função para exibir os botões de paginação
  const displayPaginationButtons = () => {
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(index + 1)}
            style={{ padding: '5px 10px', margin: '0 5px' }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  // useEffect para carregar os produtos quando o componente for montado
  useEffect(() => {
    loadProductsAlterados();
  }, []); // O array vazio significa que a função será chamada apenas uma vez

  // Obtém os produtos para a página atual
  const productsToDisplay = getProductsForPage(currentPage);

  return (
    <div>
      <h2>Produtos Alterados</h2>
      {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
      {displayProductsTable(productsToDisplay)}
      {displayPaginationButtons()}
    </div>
  );
}

export default AlteredProducts;
