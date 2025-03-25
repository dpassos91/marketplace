// ProductList.js
import React from 'react';
import ProductCard from './ProductCard';
import useProductsByCategory from './useProductsByCategory';

function ProductList({ products, categoryId }) {
  const { filteredProducts, category, error } = useProductsByCategory(products, categoryId);

  if (error) return <p className="error-message">{error}</p>;
  if (filteredProducts.length === 0) return <p className="no-products-message">Nenhum produto disponível nesta categoria.</p>;

  return (
    <div className="product-list">
      {category && <h1 id="page-title">Produtos - {category.name}</h1>}
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
