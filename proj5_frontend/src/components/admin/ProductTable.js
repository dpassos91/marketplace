import React from 'react';
import { FormattedMessage } from 'react-intl';
import SpinnerLeaf from '../commons/SpinnerLeaf';
import { PRODUCT_STATES } from '../product/productStates';

function ProductTable({
  products,
  suspendingProductId,
  deletingProductId,
  onSuspend,
  onDelete,
  onEdit
}) {
  return (
    <table>
      <thead>
        <tr>
          <th><FormattedMessage id="admin.filterByCategory.product.title" defaultMessage="Título" /></th>
          <th><FormattedMessage id="admin.filterByCategory.product.id" defaultMessage="ID" /></th>
          <th><FormattedMessage id="admin.filterByCategory.product.price" defaultMessage="Preço" /></th>
          <th><FormattedMessage id="admin.filterByCategory.product.actions" defaultMessage="Ações" /></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.title}</td>
            <td>{product.id}</td>
            <td>{product.price}€</td>
            <td style={{ textAlign: 'center' }}>
              <button
                className="btn-card tabela-btn btn-info"
                onClick={() => onEdit(product)}
                disabled={!PRODUCT_STATES.isActive(PRODUCT_STATES.fromStatus(product.productState)?.id)}
              >
                <FormattedMessage id="admin.filterByCategory.product.edit" defaultMessage="Editar" />
              </button>

              <button
                className="btn-card tabela-btn btn-danger"
                onClick={() => onSuspend(product, product.id)}
                disabled={suspendingProductId === product.id}
              >
                {suspendingProductId === product.id ? (
                  <>
                    <FormattedMessage id="admin.loading.suspending" defaultMessage="A suspender..." />
                    &nbsp;<SpinnerLeaf size={16} />
                  </>
                ) : (
                  <FormattedMessage id="admin.filterByCategory.product.suspend" defaultMessage="Suspender" />
                )}
              </button>

              <button
                className="btn-card tabela-btn btn-edit"
                onClick={() => onDelete(product, product.id)}
                disabled={deletingProductId === product.id}
              >
                {deletingProductId === product.id ? (
                  <>
                    <FormattedMessage id="admin.loading.deleting" defaultMessage="A eliminar..." />
                    &nbsp;<SpinnerLeaf size={16} />
                  </>
                ) : (
                  <FormattedMessage id="admin.filterByCategory.product.delete" defaultMessage="Eliminar" />
                )}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
