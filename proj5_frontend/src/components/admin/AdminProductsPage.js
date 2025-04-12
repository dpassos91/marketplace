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
          <button className="btn-card tabela-btn btn-danger" onClick={() => setIsAddCategoryModalOpen(true)}>
            <FormattedMessage id="admin.products.addCategory" defaultMessage="Adicionar categoria" />
          </button>
          <button className="btn-card tabela-btn btn-danger" onClick={() => setIsFilterModalOpen(true)}>
            <FormattedMessage id="admin.products.filterByCategory" defaultMessage="Filtrar por categoria" />
          </button>
        </div>

        <div className="admin-actions-column">
          <button className="btn-card tabela-btn btn-danger" onClick={() => setIsFilterBySellerModalOpen(true)}>
            <FormattedMessage id="admin.products.filterBySeller" defaultMessage="Filtrar por vendedor" />
          </button>
          <button className="btn-card tabela-btn btn-danger" onClick={handleNavigateToInativos}>
            <FormattedMessage id="admin.products.listInactive" defaultMessage="Listar produtos inativos" />
          </button>
        </div>
      </div>

      {/* Botão central */}
      <div className="admin-actions-center">
        <button className="btn-card tabela-btn btn-danger" onClick={handleNavigateToAlterados}>
          <FormattedMessage id="admin.products.showModified" defaultMessage="Mostrar produtos alterados" />
        </button>
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

