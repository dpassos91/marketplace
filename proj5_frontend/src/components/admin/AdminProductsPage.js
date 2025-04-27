import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '../admin/AddCategoryModal';
import ProductFilter from '../admin/ProductFilter';
import './AdminProductsPage.css';
import { FormattedMessage } from 'react-intl';

function AdminProductsPage() {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isProductFilterModalOpen, setIsProductFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToAlterados = () => {
    navigate('/admin/produtos/alterados');
  };

  const handleNavigateToInativos = () => {
    navigate('/admin/produtos/inativos');
  };

  return (
    <div>
      <h2 className="admin-title">
        <FormattedMessage id="admin.products.title" defaultMessage="Gestão de Produtos" />
      </h2>

      <div className="admin-actions-grid">
        <div className="admin-actions-column">
          <button className="btn-card products-btn btn-products" onClick={() => setIsAddCategoryModalOpen(true)}>
            <FormattedMessage id="admin.products.addCategory" defaultMessage="Adicionar categoria" />
          </button>
          <button className="btn-card products-btn btn-products" onClick={() => setIsProductFilterModalOpen(true)}>
            <FormattedMessage id="admin.products.deleteProductsByUser" defaultMessage="Apagar produtos" />
          </button>
          <button className="btn-card products-btn btn-products" onClick={() => setIsProductFilterModalOpen(true)}>
            <FormattedMessage id="admin.products.filter" defaultMessage="Filtrar produtos" />
          </button>
        </div>

        <div className="admin-actions-column">
          <button className="btn-card products-btn btn-products" onClick={handleNavigateToAlterados}>
            <FormattedMessage id="admin.products.showModified" defaultMessage="Mostrar produtos alterados" />
          </button>
          <button className="btn-card products-btn btn-products" onClick={handleNavigateToInativos}>
            <FormattedMessage id="admin.products.listInactive" defaultMessage="Mostrar produtos inativos" />
          </button>
        </div>
      </div>

      {/* Modais */}
      {isAddCategoryModalOpen && (
        <div style={{ zIndex: 9999 }}>
          <AddCategoryModal
            isOpen={isAddCategoryModalOpen}
            onClose={() => setIsAddCategoryModalOpen(false)}
            onCategoryAdded={() => console.log('Categoria adicionada!')}
          />
        </div>
      )}

      {isProductFilterModalOpen && (
        <div style={{ zIndex: 9999 }}>
          <ProductFilter
            isOpen={isProductFilterModalOpen}
            onClose={() => setIsProductFilterModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;


