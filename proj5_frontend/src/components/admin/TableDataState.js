import React from 'react';
import SpinnerLeaf from '../commons/SpinnerLeaf';
import { FormattedMessage } from 'react-intl';

function TableDataState({ loading, error, message, messagePrefix, image = "/img/sem-produtos.png" }) {
  if (loading) {
    return (
      <div className="loading-state">
        <SpinnerLeaf />
        <div>
          <FormattedMessage id={`${messagePrefix}.loading`} defaultMessage="A carregar dados..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <img src={image} alt="Erro ao carregar" />
        <p>
          <FormattedMessage id={`${messagePrefix}.error`} defaultMessage="Erro ao carregar dados." />
        </p>
      </div>
    );
  }

  if (message === 'empty') {
    return (
      <div className="empty-state">
        <img src={image} alt="Nenhum dado encontrado" />
        <p>
          <FormattedMessage id={`${messagePrefix}.empty`} defaultMessage="Nenhum registo encontrado." />
        </p>
      </div>
    );
  }

  return null;
}

export default TableDataState;

