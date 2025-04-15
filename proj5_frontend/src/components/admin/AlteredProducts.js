import React, { useMemo, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import useTableData from '../../hooks/useTableData';
import Pagination from '../commons/Pagination';
import TableDataState from './TableDataState';
import { productAPI } from '../../api/productAPI';

const PRODUCTS_PER_PAGE = 10;

function AlteredProducts() {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: allProducts,
    loading,
    error,
  } = useTableData(productAPI.getAllEditedProducts);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return allProducts.slice(start, end);
  }, [allProducts, currentPage]);

  const isEmpty = !allProducts || allProducts.length === 0;

  if (loading || error || isEmpty) {
    return (
      <TableDataState
        loading={loading}
        error={error}
        message={isEmpty ? 'empty' : null}
        messagePrefix="admin.alteredProducts"
        image="/img/sem-produtos.png"
      />
    );
  }

  return (
    <div>
      <h2 className="admin-title">
        <FormattedMessage id="admin.alteredProducts.title" defaultMessage="Produtos Alterados" />
      </h2>
      <table>
        <thead>
          <tr>
            <th><FormattedMessage id="admin.product.name" defaultMessage="Nome" /></th>
            <th><FormattedMessage id="admin.product.price" defaultMessage="Preço" /></th>
            <th><FormattedMessage id="admin.product.id" defaultMessage="ID Produto" /></th>
            <th><FormattedMessage id="admin.product.username" defaultMessage="Username" /></th>
            <th><FormattedMessage id="admin.product.editDate" defaultMessage="Data de Alteração" /></th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.price}€</td>
              <td>{product.id}</td>
              <td>{product.sellerUsername}</td>
              <td>{intl.formatDate(product.editDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalPages={Math.ceil(allProducts.length / PRODUCTS_PER_PAGE)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AlteredProducts;

