// ProductList.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { productAPI } from '../api/productAPI.js';
import useAuthStore from '../stores/authStore.js';

function ProductList() {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();
    const user = useAuthStore(state => state.user);

    useEffect(() => {
        async function fetchProducts() {
            const userId = user ? user.id : null;
            const allProducts = await productAPI.getAllActiveProducts(userId);
            if (categoryId) {
                const filteredProducts = allProducts.filter(product => String(product.categoryId) === String(categoryId));
                setProducts(filteredProducts);
            } else {
                setProducts(allProducts);
            }
        }
        fetchProducts();
    }, [categoryId, user]);

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;
