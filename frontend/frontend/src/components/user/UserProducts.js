import React from 'react';
import ProductCard from './../components/product/ProductCard';
import useUserProducts from '../hooks/useUserProducts';

function UserProducts({ userId, isOwnProfile }) {
    const { products } = useUserProducts(userId);

    if (products.length === 0) {
        return (
            <p className="no-products-message">
                {isOwnProfile
                    ? 'Não tem produtos para venda.'
                    : 'Este utilizador não tem produtos para venda.'}
            </p>
        );
    }

    return (
        <div className="card-container">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
