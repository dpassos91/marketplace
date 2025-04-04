import React, { useState } from 'react';
import Modal from '../commons/Modal'; // Importa o componente Modal
import { apiConfig } from '../../api/apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

function AddCategoryModal({ isOpen, onClose, onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = async () => {
    if (!categoryName) {
      alert('Por favor, insira um nome para a categoria');
      return;
    }

    try {
      await apiCall(API_ENDPOINTS.categories.create, {
        method: 'POST',
        body: JSON.stringify({ name: categoryName }),
      });

      console.log(`Nova categoria "${categoryName}" adicionada com sucesso`);
      alert('Nova categoria adicionada com sucesso!');

      setCategoryName(''); // Limpa o campo
      onCategoryAdded(); // Atualiza a lista de categorias na página principal
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      alert('Erro ao adicionar categoria.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Categoria">
      <input
        type="text"
        placeholder="Nome da categoria"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <button onClick={handleAddCategory}>Adicionar</button>
      <button onClick={onClose}>Cancelar</button>
    </Modal>
  );
}

export default AddCategoryModal;
