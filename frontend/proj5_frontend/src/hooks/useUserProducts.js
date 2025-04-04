import { useState, useEffect } from 'react';
import { productAPI } from '../api/productAPI';

function useUserProducts(userId) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedProducts = await productAPI.getProductsBySeller(userId);
                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Falha ao carregar os produtos do utilizador:', error);
                setError('Falha ao carregar os produtos do utilizador.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [userId]);

    return { products, loading, error };
}

export default useUserProducts;
