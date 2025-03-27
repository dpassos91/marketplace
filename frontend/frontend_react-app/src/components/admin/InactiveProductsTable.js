import React, { useState, useEffect, useCallback } from 'react';
import { apiConfig } from '../../api/apiConfig'; // Importe a configuração da API

const PRODUCTS_PER_PAGE = 10;

function InactiveProductsTable() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Use a função apiCall da sua configuração
        const data = await apiConfig.apiCall(apiConfig.API_ENDPOINTS.products.inactive);
        if (!Array.isArray(data)) {
          throw new Error('Unexpected data format');
        }
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError('Erro ao carregar produtos.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getProductsForPage = useCallback((page) => {
    const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return [...products].sort((a, b) => (a.title || '').localeCompare(b.title || '')).slice(startIndex, endIndex);
  }, [products]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Tem certeza de que deseja excluir o produto "${productName}" (ID: ${productId})?`)) {
      try {
        // Use a função apiCall para excluir o produto
        await apiConfig.apiCall(apiConfig.API_ENDPOINTS.products.permanentDelete(productId), {
          method: 'DELETE', // Especifica o método DELETE
        });
        setProducts(products.filter(product => product.id !== productId));
        alert(`Produto "${productName}" excluído com sucesso.`);
      } catch (err) {
        console.error('Erro ao excluir produto:', err);
        alert('Erro ao excluir produto.');
      }
    }
  };

  if (loading) {
    return <div>A carregar produtos...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (products.length === 0) {
    return <div>Nenhum produto inativo encontrado.</div>;
  }

  return (
    <div>
      <h2>Produtos Inativos</h2>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Nome</th>
            <th style={{ textAlign: 'center' }}>Preço</th>
            <th style={{ textAlign: 'center' }}>ID Produto</th>
            <th style={{ textAlign: 'center' }}>Username</th>
            <th style={{ textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {getProductsForPage(currentPage).map(product => (
            <tr key={product.id}>
              <td style={{ textAlign: 'center' }}>{product.title}</td>
              <td style={{ textAlign: 'center' }}>{product.price}</td>
              <td style={{ textAlign: 'center' }}>{product.id}</td>
              <td style={{ textAlign: 'center' }}>{product.sellerUsername}</td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <button
                    className="btn-card tabela-btn btn-danger"
                    onClick={() => handleDeleteProduct(product.id, product.title)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: page === currentPage ? '#007bff' : '#f0f0f0',
              color: page === currentPage ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default InactiveProductsTable;
