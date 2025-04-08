import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { FormattedMessage } from 'react-intl';

function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div className="card">
            <img src={product.imageUrl} alt={product.title} />
            <div>
                <h1>{product.title}</h1>
                <h4>{product.location}</h4>
                <h2>{product.categoryName}</h2>
                <h4>{parseFloat(product.price).toFixed(2)}€</h4>
                <button
  type="button"
  title="descricao"
  onClick={() => navigate(`/detalhes-produto/${product.id}`)}
>
  <FormattedMessage id="productCard.moreInfo" defaultMessage="Saber mais" />
</button>
            </div>
        </div>
    );
}

export default ProductCard;
