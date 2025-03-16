import React, { useState, useEffect } from 'react';

function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Aqui você fará a chamada à API para buscar os produtos
    // Por exemplo:
    // fetchProducts().then(data => setProducts(data));
  }, []);

  return (
    <div className="main-content">
      <h1 id="page-title" className="product-list-title">Produtos</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product">
            {/* Renderize cada produto aqui */}
            {/* Por exemplo: */}
            <h2>{product.name}</h2>
            <img src={product.image} alt={product.name} />
            <p>{product.description}</p>
            <p>Preço: {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
