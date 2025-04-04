import React, { useState, useEffect } from 'react';
import { apiConfig } from '../../api/apiConfig';
import EditProductModal from '../commons/EditProductModal';
import useProductActions from '../../hooks/useProductActions';

const { apiCall, API_ENDPOINTS } = apiConfig;

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const { handleDelete, handleEdit } = useProductActions(setProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.products.getAll);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Gestão de Produtos</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.price}€</td>
              <td>{product.categoryName}</td>
              <td>
                <button onClick={() => setProductToEdit(product)}>Editar</button>
                <button onClick={() => handleDelete(product.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {productToEdit && (
        <EditProductModal
          product={productToEdit}
          onClose={() => setProductToEdit(null)}
          onSave={(updatedProduct) => handleEdit(updatedProduct)}
        />
      )}
    </div>
  );
}

export default ProductManagement;
