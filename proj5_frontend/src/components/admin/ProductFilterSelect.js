import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

function ProductFilterSelect({ selection, setSelection, sellerId, setSellerId, categories, onCancel }) {
  const intl = useIntl();

  const handleInvalid = (e) => {
    const message = intl.formatMessage({
      id: 'admin.filterBySeller.error.invalid',
      defaultMessage: 'Por favor, insira um número inteiro para o ID do vendedor.'
    });
    e.target.setCustomValidity(message);
  };

  const handleInput = (e) => {
    e.target.setCustomValidity('');
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <select
        value={selection}
        onChange={(e) => setSelection(e.target.value)}
        required
      >
        <option value="" disabled>
          {intl.formatMessage({ id: 'admin.productFilter.placeholder.select', defaultMessage: 'Selecione uma opção' })}
        </option>
        <optgroup label={intl.formatMessage({ id: 'admin.productFilter.group.categories', defaultMessage: 'Categorias' })}>
          {categories.map((category) => (
            <option key={category.id} value={`cat-${category.id}`}>
              {category.name}
            </option>
          ))}
        </optgroup>
        <optgroup label={intl.formatMessage({ id: 'admin.productFilter.group.other', defaultMessage: 'Outros' })}>
          <option value="seller">
            🔍 {intl.formatMessage({ id: 'admin.filterBySeller.title', defaultMessage: 'Procurar por vendedor' })}
          </option>
        </optgroup>
      </select>

      {selection === 'seller' && (
        <input
        type="number"
        step="1"
        min="1"
        value={sellerId}
        onChange={(e) => setSellerId(e.target.value)}
        onInvalid={handleInvalid}
        onInput={handleInput}
        placeholder={intl.formatMessage({
          id: 'admin.filterBySeller.placeholder.sellerId',
          defaultMessage: 'ID do Vendedor'
        })}
        required
      />
      
      )}

      <button type="button" onClick={onCancel}>
        <FormattedMessage id="admin.common.cancel" defaultMessage="Cancelar" />
      </button>
    </form>
  );
}

export default ProductFilterSelect;
