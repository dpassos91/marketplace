import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../api/productAPI';
import { PRODUCT_STATES } from '../components/product/productStates'; // Importe os estados do produto
import ProductCard from '../components/product/ProductCard';

function ProductsPage() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const categoryId = searchParams.get('categoria');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let fetchedProducts;
                if (categoryId) {
                    fetchedProducts = await productAPI.getProductsByCategory(categoryId);
                } else {
                    fetchedProducts = await productAPI.getAllActiveProducts();
                }

                // Filtra produtos ativos e não comprados
                const availableProducts = fetchedProducts.filter(product => 
                    product.active && product.status !== PRODUCT_STATES.COMPRADO.description
                );

                setProducts(availableProducts);

                if (categoryId && availableProducts.length > 0) {
                    setCategoryName(availableProducts[0].categoryName);
                } else if (categoryId) {
                    const categoryData = await productAPI.getCategoryById(categoryId);
                    setCategoryName(categoryData.name);
                }
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (loading) return <div>Carregando produtos...</div>;

    return (
        <div className="main-content">
            <h1 id="page-title" className="product-list-title">
                {categoryId ? `Produtos da Categoria ${categoryName}` : 'Todos os Produtos'}
            </h1>
            <div className="product-list">
                {products.length === 0 ? (
                    <p>Nenhum produto disponível encontrado.</p>
                ) : (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

export default ProductsPage;


