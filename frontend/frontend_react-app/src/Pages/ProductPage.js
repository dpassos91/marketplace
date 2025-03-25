import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../api/productAPI';
import { productComponents } from '../components/productComponents'; // Importa productComponents

function ProductsPage() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const categoryId = searchParams.get('category');

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
                setProducts(fetchedProducts);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                // Trate o erro adequadamente, talvez exibindo uma mensagem para o usuário
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
                {categoryId ? `Produtos da Categoria ${categoryId}` : 'Todos os Produtos'}
            </h1>
            <div className="product-list">
                {products.length === 0 ? (
                    <p>Nenhum produto encontrado.</p>
                ) : (
                    products.map(product => (
                        <productComponents.ProductCard key={product.id} product={product} />  // Usa productComponents.ProductCard
                    ))
                )}
            </div>
        </div>
    );
}

export default ProductsPage;
