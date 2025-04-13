import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '../admin/AddCategoryModal';
import FilterProductsByCategory from '../admin/FilterProductsByCategory';
import FilterProductsBySeller from '../admin/FilterProductsBySeller';
import './AdminProductsPage.css';
import { FormattedMessage } from 'react-intl';

function AdminProductsPage() {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isFilterBySellerModalOpen, setIsFilterBySellerModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToInativos = () => {
    navigate('/admin/produtos/inativos');
  };

  const handleNavigateToAlterados = () => {
    navigate('/admin/produtos/alterados');
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
          <button className="btn-card products-btn btn-products" onClick={() => setIsFilterModalOpen(true)}>
            <FormattedMessage id="admin.products.filterByCategory" defaultMessage="Filtrar por categoria" />
          </button>
          <button className="btn-card products-btn btn-products" onClick={() => setIsFilterBySellerModalOpen(true)}>
            <FormattedMessage id="admin.products.filterBySeller" defaultMessage="Filtrar por vendedor" />
          </button>
        </div>

        <div className="admin-actions-column">
          
          <button className="btn-card products-btn btn-products" onClick={handleNavigateToAlterados}>
          <FormattedMessage id="admin.products.showModified" defaultMessage="Mostrar produtos alterados" />
        </button>
        <button className="btn-card products-btn btn-products" onClick={handleNavigateToInativos}>
            <FormattedMessage id="admin.products.listBought" defaultMessage="Mostrar produtos comprados" />
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

      {isFilterModalOpen && (
        <div style={{ zIndex: 9999 }}>
          <FilterProductsByCategory
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
          />
        </div>
      )}

      {isFilterBySellerModalOpen && (
        <div style={{ zIndex: 9999 }}>
          <FilterProductsBySeller
            isOpen={isFilterBySellerModalOpen}
            onClose={() => setIsFilterBySellerModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;

