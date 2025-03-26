// RecentProducts.js
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { productAPI } from '../api/productAPI.js';

function RecentProducts() {
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        async function fetchRecentProducts() {
            const products = await productAPI.getAllActiveProducts();
            const mostRecent = products
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);
            setRecentProducts(mostRecent);
        }
        fetchRecentProducts();
    }, []);

    return (
        <div className="recent-products">
            {recentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default RecentProducts;
