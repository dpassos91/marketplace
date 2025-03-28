import React, { useState, useEffect } from 'react';
import Modal from '../commons/Modal';
import { apiConfig } from '../../api/apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

function EditProductModal({ product, onClose, onSave }) {
  const [editedTitle, setEditedTitle] = useState(product.title);
  const [editedPrice, setEditedPrice] = useState(product.price.toString());
  const [editedCategory, setEditedCategory] = useState(product.categoryId); // Usar o ID da categoria
  const [editedLocation, setEditedLocation] = useState(product.location || ''); // Localização
  const [editedDescription, setEditedDescription] = useState(product.description || ''); // Descrição
  const [editedStatus, setEditedStatus] = useState(product.status || ''); // Estado
  const [categories, setCategories] = useState([]);

  // Carregar categorias disponíveis no sistema
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiCall(API_ENDPOINTS.categories.all);
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!editedTitle.trim() || editedPrice <= 0 || !editedCategory || !editedLocation.trim() || !editedDescription.trim()) {
      alert('Preencha todos os campos corretamente.');
      return;
    }

    const updatedProduct = {
      ...product,
      title: editedTitle,
      price: parseFloat(editedPrice),
      categoryId: editedCategory,
      location: editedLocation,
      description: editedDescription,
      status: editedStatus,
    };

    try {
      await apiCall(API_ENDPOINTS.products.update(updatedProduct.id), updatedProduct);
      alert('Produto atualizado com sucesso!');
      onSave(updatedProduct); // Atualiza o estado no componente pai
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao salvar as alterações. Tente novamente.');
    }
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} title="Editar Produto">
      <div style={{ padding: '10px' }}>
        {/* Campo: Título */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="edit-title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Título do Produto:
          </label>
          <input
            id="edit-title"
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Digite o título do produto"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Campo: Preço */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="edit-price" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Preço (€):
          </label>
          <input
            id="edit-price"
            type="number"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
            placeholder="Digite o preço do produto"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Campo: Categoria */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="edit-category" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Categoria:
          </label>
          <select
            id="edit-category"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo: Localização */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="edit-location" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Localização:
          </label>
          <input
            id="edit-location"
            type="text"
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
            placeholder="Digite a localização do produto"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Campo: Descrição */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="edit-description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Descrição:
          </label>
          <textarea
            id="edit-description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Digite a descrição do produto"
            rows={3}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Campo: Estado */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="edit-status" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Estado:
          </label>
          <select
            id="edit-status"
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Selecione o estado</option>
            <option value="1">Disponível</option>
            <option value="2">Comprado</option>
            <option value="3">Reservado</option>
          </select>
        </div>

        {/* Botões de Ação */}
        <div style={{ textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-card tabela-btn btn-danger"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-card tabela-btn btn-info"
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default EditProductModal;




