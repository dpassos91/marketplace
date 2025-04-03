import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '../admin/AddCategoryModal';
import FilterProductsByCategory from '../admin/FilterProductsByCategory'; // Importar o modal de filtro por categoria
import FilterProductsBySeller from '../admin/FilterProductsBySeller'; // Importar o modal de filtro por vendedor

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
      <h2>Gestão de Produtos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-primary" onClick={() => setIsAddCategoryModalOpen(true)}>
          Adicionar categoria
        </button>
        <button className="btn-primary" onClick={handleNavigateToInativos}>
          Listar produtos inativos
        </button>
        <button className="btn-primary" onClick={() => setIsFilterModalOpen(true)}>
          Filtrar por categoria
        </button>
        <button className="btn-primary" onClick={() => setIsFilterBySellerModalOpen(true)}>
          Filtrar por vendedor
        </button>
        <button className="btn-primary" onClick={handleNavigateToAlterados}>
          Mostrar produtos alterados
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
