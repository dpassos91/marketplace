// hooks/useUserProducts.js
import { useState, useEffect } from 'react';
import { productAPI } from '../api/productAPI';

function useUserProducts(userId) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await productAPI.getProductsBySeller(userId);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error loading user products:', error);
            }
        };

        fetchProducts();
    }, [userId]);

    return { products };
}

export default useUserProducts;
