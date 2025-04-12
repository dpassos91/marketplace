import React, { useState } from 'react';
import Modal from '../commons/Modal';
import { apiConfig } from '../../api/apiConfig';
import { useIntl, FormattedMessage } from 'react-intl';

const { apiCall, API_ENDPOINTS } = apiConfig;

function AddCategoryModal({ isOpen, onClose, onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState('');
  const intl = useIntl();

  const handleInvalid = (e) => {
    const message = intl.formatMessage({
      id: 'admin.addCategory.error.required',
      defaultMessage: 'Por favor, insira um nome para a categoria',
    });
    e.target.setCustomValidity(message);
  };

  const handleInput = (e) => {
    e.target.setCustomValidity('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiCall(API_ENDPOINTS.categories.create, {
        method: 'POST',
        body: JSON.stringify({ name: categoryName }),
      });

      alert(intl.formatMessage({
        id: 'admin.addCategory.success',
        defaultMessage: 'Nova categoria adicionada com sucesso!',
      }));

      setCategoryName('');
      onCategoryAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      alert(intl.formatMessage({
        id: 'admin.addCategory.error.generic',
        defaultMessage: 'Erro ao adicionar categoria.',
      }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({ id: 'admin.addCategory.title', defaultMessage: 'Adicionar Nova Categoria' })}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={intl.formatMessage({ id: 'admin.addCategory.placeholder.name', defaultMessage: 'Nome da categoria' })}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
          onInvalid={handleInvalid}
          onInput={handleInput}
        />
        <button type="submit">
          <FormattedMessage id="admin.common.add" defaultMessage="Adicionar" />
        </button>
        <button type="button" onClick={onClose}>
          <FormattedMessage id="admin.common.cancel" defaultMessage="Cancelar" />
        </button>
      </form>
    </Modal>
  );
}

export default AddCategoryModal;

