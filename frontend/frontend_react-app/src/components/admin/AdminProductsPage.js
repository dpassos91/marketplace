import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '../admin/AddCategoryModal';
import FilterProductsByCategory from '../admin/FilterProductsByCategory'; // Importar o modal de filtro


function AdminProductsPage() {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Novo estado para o filtro
  const navigate = useNavigate();

  const handleNavigateToInativos = () => {
    navigate('/admin/produtos/inativos');
  };

  return (
    <div>
      <h2>Gestão de Produtos - Área Administrativa</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-primary" onClick={() => setIsAddCategoryModalOpen(true)}>
          Adicionar Categoria
        </button>
        <button className="btn-primary" onClick={handleNavigateToInativos}>
          Listar Produtos Inativos
        </button>
        <button className="btn-primary" onClick={() => setIsFilterModalOpen(true)}>
          Filtrar por Categoria
        </button>
        <button className="btn-primary" onClick={() => navigate('/admin/produtos/filtrar-vendedor')}>
          Filtrar por Vendedor
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
    </div>
  );
}

export default AdminProductsPage;
