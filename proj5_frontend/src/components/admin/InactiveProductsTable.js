import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Pagination from '../commons/Pagination';
import { PRODUCT_STATES } from '../product/productStates';
import TableDataState from './TableDataState';
import usePaginationTable from '../../hooks/usePaginationTable';
import useTableData from '../../hooks/useTableData';
import { productAPI } from '../../api/productAPI';

const PRODUCTS_PER_PAGE = 10;

const ProductRow = React.memo(({ product, onAction }) => (
  <tr>
    <td>{product.title}</td>
    <td>{product.price}</td>
    <td>{product.id}</td>
    <td>{product.sellerUsername}</td>
    <td>
      <div className="table-actions">
        <button
          className="btn-card tabela-btn btn-danger"
          onClick={() => onAction(product.id, 'reactivate', product.title)}
        >
          <FormattedMessage id="admin.productTable.reactivate" defaultMessage="Reactivar" />
        </button>
        <button
          className="btn-card tabela-btn btn-edit"
          onClick={() => onAction(product.id, 'delete', product.title)}
        >
          <FormattedMessage id="admin.productTable.delete" defaultMessage="Eliminar" />
        </button>
      </div>
    </td>
  </tr>
));

const InactiveProductsTable = () => {
  const intl = useIntl();

  const {
    data: products,
    loading,
    error,
    removeItem,
  } = useTableData(productAPI.getInactiveProducts);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
  } = usePaginationTable(
    products,
    PRODUCTS_PER_PAGE,
    (a, b) => (a.title || '').localeCompare(b.title || '')
  );

  const handleAction = useCallback(async (productId, action, name) => {
    const confirmMessage = intl.formatMessage(
      { id: `admin.window.confirm.products.${action}` },
      { productId, name }
    );

    if (window.confirm(confirmMessage)) {
      try {
        if (action === 'delete') {
          await productAPI.permanentlyDeleteProduct(productId);
          removeItem(productId);
        } else if (action === 'reactivate') {
          await productAPI.reactivateProduct(productId, PRODUCT_STATES.DISPONIVEL.id);
          removeItem(productId);
        }

        alert(intl.formatMessage(
          { id: `admin.alert.success.products.${action}` },
          { productId, name }
        ));
      } catch (err) {
        console.error(err);
        alert(intl.formatMessage({ id: `admin.alert.error.products.${action}` }));
      }
    }
  }, [intl, removeItem]);

  const isEmpty = !products || products.length === 0;

  if (loading || error || isEmpty) {
    return (
      <TableDataState
        loading={loading}
        error={error}
        message={isEmpty ? 'empty' : null}
        messagePrefix="admin.productTable"
        image="/img/sem-produtos.png"
      />
    );
  }

  return (
    <div>
      <h2 className="admin-title">
        <FormattedMessage id="admin.productTable.title" defaultMessage="Produtos Inativos" />
      </h2>
      <table>
        <thead>
          <tr>
            <th><FormattedMessage id="admin.productTable.name" defaultMessage="Nome" /></th>
            <th><FormattedMessage id="admin.productTable.price" defaultMessage="Preço" /></th>
            <th><FormattedMessage id="admin.productTable.id" defaultMessage="ID Produto" /></th>
            <th><FormattedMessage id="admin.productTable.seller" defaultMessage="Username" /></th>
            <th><FormattedMessage id="admin.productTable.actions" defaultMessage="Ações" /></th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((product) => (
            <ProductRow key={product.id} product={product} onAction={handleAction} />
          ))}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default InactiveProductsTable;


