import { useCallback } from 'react';
import { apiConfig } from '../api/apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

const useProductActions = (setProducts) => {
  const handleDelete = useCallback(async (productId) => {
    try {
      await apiCall(API_ENDPOINTS.products.permanentDelete(productId));
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  }, [setProducts]);

  const handleEdit = useCallback(async (updatedProduct) => {
    try {
      await apiCall(API_ENDPOINTS.products.update(updatedProduct.id), updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
      );
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  }, [setProducts]);

  return { handleDelete, handleEdit };
};

export default useProductActions;
