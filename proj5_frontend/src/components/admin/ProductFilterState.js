import React from 'react';
import SpinnerLeaf from '../commons/SpinnerLeaf';
import { FormattedMessage } from 'react-intl';

function ProductFilterState({ loading, error, message }) {
  if (loading) {
    return (
      <div className="loading-products">
        <SpinnerLeaf />
        <div>
          <FormattedMessage id="admin.productTable.loading" defaultMessage="A carregar produtos..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-products">
        <img src="/img/sem-produtos.png" alt="Erro ao carregar produtos" />
        <p>
          <FormattedMessage id="admin.productTable.error" defaultMessage="Erro ao carregar produtos." />
        </p>
      </div>
    );
  }

  if (message === 'empty') {
    return (
      <div className="empty-products">
        <img src="/img/sem-produtos.png" alt="Nenhum produto encontrado" />
        <p>
          <FormattedMessage id="admin.productTable.empty" defaultMessage="Nenhum produto encontrado." />
        </p>
      </div>
    );
  }

  return null;
}

export default ProductFilterState;
