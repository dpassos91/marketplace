import React, { useState } from 'react';
import AddCategoryModal from '../admin/AddCategoryModal';

function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h2>Gestão de Produtos - Área Administrativa</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Adicionar Categoria
        </button>
        <button className="btn-primary">Listar Produtos Inativos</button>
        <button className="btn-primary">Filtrar por Categoria</button>
        <button className="btn-primary">Filtrar por Vendedor</button>
      </div>

      {/* Modal */}
      <AddCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCategoryAdded={() => console.log('Categoria adicionada!')} />
    </div>
  );
}

export default AdminProductsPage;
