import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';
import { FormattedMessage } from 'react-intl';

function CategoryCard({ category }) {
  const navigate = useNavigate();
  const imageUrl = category.imageUrl || 'https://ps.w.org/gazchaps-woocommerce-auto-category-product-thumbnails/assets/icon-256x256.png?rev=1848416';

  return (
    <div className="card category-card">
      <img src={imageUrl} alt={category.name} />
      <div>
        <h1>{category.name}</h1>
        <button 
  type="button" 
  title={category.name}
  onClick={() => {
    navigate(`/produtos?categoria=${category.id}`);
  }}
>
  <FormattedMessage id="categoryCard.viewProducts" defaultMessage="Ver produtos" />
</button>
      </div>
    </div>
  );
}

export default CategoryCard;
