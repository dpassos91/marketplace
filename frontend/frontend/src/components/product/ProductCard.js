// ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div className="card">
            <img src={product.imageUrl} alt={product.title} />
            <div>
                <h1>{product.title}</h1>
                <h4>{product.location}</h4>
                <h2>{product.categoryName}</h2>
                <span>{parseFloat(product.price).toFixed(2)}€</span>
                <button
                    type="button"
                    title="descricao"
                    onClick={() => navigate(`/detalhes-produto/${product.id}`)}
                >
                    Saber mais
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
