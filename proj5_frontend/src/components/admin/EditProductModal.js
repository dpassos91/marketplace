import React, { useState, useEffect } from 'react';
import Modal from '../commons/Modal';
import { apiConfig } from '../../api/apiConfig';
import { FormattedMessage, useIntl } from 'react-intl';

const { apiCall, API_ENDPOINTS } = apiConfig;

function EditProductModal({ product, onClose, onSave }) {
  const { formatMessage } = useIntl();

  const [editedTitle, setEditedTitle] = useState(product.title);
  const [editedPrice, setEditedPrice] = useState(product.price.toString());
  const [editedCategory, setEditedCategory] = useState(product.categoryId);
  const [editedLocation, setEditedLocation] = useState(product.location || '');
  const [editedDescription, setEditedDescription] = useState(product.description || '');
  const [editedStatus, setEditedStatus] = useState(product.status || '');
  const [categories, setCategories] = useState([]);

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
      alert(formatMessage({ id: 'admin.editProduct.alert.missingFields', defaultMessage: 'Preencha todos os campos corretamente.' }));
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
      alert(formatMessage({ id: 'admin.editProduct.alert.success', defaultMessage: 'Produto atualizado com sucesso!' }));
      onSave(updatedProduct);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert(formatMessage({ id: 'admin.editProduct.alert.error', defaultMessage: 'Erro ao salvar as alterações. Tente novamente.' }));
    }
  };

  return (
    <Modal isOpen={!!product} onClose={onClose} title={formatMessage({ id: 'admin.editProduct.title', defaultMessage: 'Editar Produto' })}>
      <div style={{ padding: '10px' }}>
        {/* Conteúdo do Modal com IDs atualizados com prefixo "admin" */}
      </div>
    </Modal>
  );
}

export default EditProductModal;




