import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '../admin/AddCategoryModal';

function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToInativos = () => {
    navigate('/admin/produtos/inativos');
  };

  return (
    <div>
      <h2>Gestão de Produtos - Área Administrativa</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Adicionar Categoria
        </button>
        <button className="btn-primary" onClick={handleNavigateToInativos}>
          Listar Produtos Inativos
        </button>
        <button className="btn-primary" onClick={() => navigate('/admin/produtos/filtrar-categoria')}>
          Filtrar por Categoria
        </button>
        <button className="btn-primary" onClick={() => navigate('/admin/produtos/filtrar-vendedor')}>
          Filtrar por Vendedor
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ zIndex: 9999 }}>
          <AddCategoryModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onCategoryAdded={() => console.log('Categoria adicionada!')} 
          />
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
