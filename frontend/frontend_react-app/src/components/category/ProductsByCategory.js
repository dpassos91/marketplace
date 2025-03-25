import { useState, useEffect } from 'react';
import { categoryAPI } from '../../api/categoryAPI';

function ProductsByCategory(products, categoryId) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const filterProducts = async () => {
      try {
        const categoryData = await categoryAPI.getCategoryById(categoryId);
        setCategory(categoryData);

        const filtered = products.filter(
          product => String(product.categoryId) === String(categoryId)
        );
        setFilteredProducts(filtered);
      } catch (err) {
        console.error('Error filtering products by category:', err);
        setError('Erro ao carregar produtos desta categoria.');
      }
    };

    if (categoryId) {
      filterProducts();
    } else {
      setFilteredProducts(products);
    }
  }, [products, categoryId]);

  return { filteredProducts, category, error };
}

export default ProductsByCategory;
