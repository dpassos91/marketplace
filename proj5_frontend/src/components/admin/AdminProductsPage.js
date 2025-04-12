import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '../admin/AddCategoryModal';
import FilterProductsByCategory from '../admin/FilterProductsByCategory'; // Importar o modal de filtro por categoria
import FilterProductsBySeller from '../admin/FilterProductsBySeller'; // Importar o modal de filtro por vendedor
import './AdminProductsPage.css'; // Importar o CSS para estilização

function AdminProductsPage() {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Novo estado para o filtro por categoria
  const [isFilterBySellerModalOpen, setIsFilterBySellerModalOpen] = useState(false); // Novo estado para o filtro por vendedor
  const navigate = useNavigate();

  const handleNavigateToInativos = () => {
    navigate('/admin/produtos/inativos');
  };

  const handleNavigateToAlterados = () => {
    navigate('/admin/produtos/alterados');
  };

  return (
    <div>
      <h2 className="admin-title">Gestão de Produtos</h2>
      <div className="admin-actions-grid">
  <div className="admin-actions-column">
    <button className="btn-card tabela-btn btn-danger" onClick={() => setIsAddCategoryModalOpen(true)}>
      Adicionar categoria
    </button>
    <button className="btn-card tabela-btn btn-danger" onClick={handleNavigateToInativos}>
      Listar produtos inativos
    </button>
    <button className="btn-card tabela-btn btn-danger" onClick={() => setIsFilterModalOpen(true)}>
      Filtrar por categoria
    </button>
  </div>
  <div className="admin-actions-column">
    <button className="btn-card tabela-btn btn-danger" onClick={() => setIsFilterBySellerModalOpen(true)}>
      Filtrar por vendedor
    </button>
    <button className="btn-card tabela-btn btn-danger" onClick={handleNavigateToAlterados}>
      Mostrar produtos alterados
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
