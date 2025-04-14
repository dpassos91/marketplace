import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../commons/Modal';
import EditProductForm from '../product/EditProductForm';
import { apiConfig } from '../../api/apiConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import { productAPI } from '../../api/productAPI';
import useProductStore from '../../stores/productStore';
import SpinnerLeaf from '../commons/SpinnerLeaf';
import { PRODUCT_STATES } from '../product/productStates';
import './UserTable.css';

const { apiCall, API_ENDPOINTS } = apiConfig;

function ProductFilter({ isOpen, onClose }) {
  const intl = useIntl();
  const { setProduct } = useProductStore();
  const [categories, setCategories] = useState([]);
  const [selection, setSelection] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [suspendingProductId, setSuspendingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const data = await apiCall(API_ENDPOINTS.categories.all);
          setCategories(data);
        } catch (error) {
          console.error(intl.formatMessage({ id: 'admin.filterByCategory.error.loadCategories' }), error);
        }
      };
      fetchCategories();
    }
  }, [isOpen, intl]);

  useEffect(() => {
    setProducts([]);
    setMessage('');
    setSellerId('');

    if (selection.startsWith('cat-')) {
      handleSearch();
    }
  }, [selection]);

  useEffect(() => {
    if (selection === 'seller' && sellerId.trim()) {
      const delayDebounce = setTimeout(() => {
        handleSearch();
      }, 600);
      return () => clearTimeout(delayDebounce);
    }
  }, [sellerId]);

  const handleSearch = useCallback(async () => {
    setProducts([]);
    setMessage('');
    setError(false);
    setLoading(true);

    try {
      let data = [];
      if (selection.startsWith('cat-')) {
        const categoryId = selection.replace('cat-', '');
        data = await apiCall(API_ENDPOINTS.products.byCategory(categoryId));
      } else if (selection === 'seller' && sellerId.trim()) {
        data = await apiCall(API_ENDPOINTS.products.bySeller(sellerId));
      } else {
        setLoading(false);
        setMessage('empty');
        return;
      }

      const availableProducts = data.filter((product) => {
        const state = PRODUCT_STATES.fromStatus(product.productState);
        return state && PRODUCT_STATES.isActive(state.id) && state.id !== PRODUCT_STATES.COMPRADO.id;
      });

      setProducts(availableProducts);
      if (availableProducts.length === 0) setMessage('empty');
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [selection, sellerId]);

  const handleSuspendProduct = async (product, productId) => {
    const confirmed = window.confirm(intl.formatMessage({ id: 'admin.filterByCategory.window.confirm.suspendProduct' }, { name: product.title }));
    if (!confirmed) return;

    setSuspendingProductId(productId);
    try {
      await productAPI.softDeleteProduct(productId);
      alert(intl.formatMessage({ id: 'admin.filterByCategory.alert.success.suspendProduct' }, { name: product.title }));
      handleSearch();
    } catch (error) {
      console.error(error);
      alert(intl.formatMessage({ id: 'admin.filterByCategory.alert.error.suspendProduct' }));
    } finally {
      setSuspendingProductId(null);
    }
  };

  const handleDeleteProduct = async (product, productId) => {
    const confirmed = window.confirm(intl.formatMessage({ id: 'admin.filterByCategory.window.confirm.deleteProduct' }, { name: product.title }));
    if (!confirmed) return;

    setDeletingProductId(productId);
    try {
      await productAPI.permanentlyDeleteProduct(productId);
      alert(intl.formatMessage({ id: 'admin.filterByCategory.alert.success.deleteProduct' }, { name: product.title }));
      handleSearch();
    } catch (error) {
      console.error(error);
      alert(intl.formatMessage({ id: 'admin.filterByCategory.alert.error.deleteProduct' }));
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={intl.formatMessage({ id: 'admin.productFilter.title', defaultMessage: 'Filtrar Produtos' })}>
      <form onSubmit={(e) => e.preventDefault()}>
        <select
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
          required
        >
          <option value="" disabled hidden>
            {intl.formatMessage({ id: 'admin.productFilter.selectOption', defaultMessage: 'Selecione uma opção' })}
          </option>
          <optgroup label={intl.formatMessage({ id: 'admin.productFilter.group.categories', defaultMessage: 'Categorias' })}>
            {categories.map((category) => (
              <option key={category.id} value={`cat-${category.id}`}>
                {category.name}
              </option>
            ))}
          </optgroup>
          <optgroup label={intl.formatMessage({ id: 'admin.productFilter.group.other', defaultMessage: 'Outros' })}>
            <option value="seller">🔍 {intl.formatMessage({ id: 'admin.filterBySeller.title', defaultMessage: 'Procurar por vendedor' })}</option>
          </optgroup>
        </select>

        {selection === 'seller' && (
          <input
            type="text"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder={intl.formatMessage({ id: 'admin.filterBySeller.placeholder.sellerId', defaultMessage: 'ID do Vendedor' })}
            required
          />
        )}

        <button type="button" onClick={onClose}>
          <FormattedMessage id="admin.common.cancel" defaultMessage="Cancelar" />
        </button>
      </form>

      {loading && (
        <div className="loading-products">
          <SpinnerLeaf />
          <div>
            <FormattedMessage id="admin.productTable.loading" defaultMessage="A carregar produtos..." />
          </div>
        </div>
      )}

      {error && (
        <div className="error-products">
          <img src="/img/erro-produtos.png" alt="Erro ao carregar produtos" />
          <p><FormattedMessage id="admin.productTable.error" defaultMessage="Erro ao carregar produtos." /></p>
        </div>
      )}

      {message === 'empty' && (
        <div className="empty-products">
          <img src="/img/sem-produtos.png" alt="Nenhum produto encontrado" />
          <p><FormattedMessage id="admin.productTable.empty" defaultMessage="Nenhum produto encontrado." /></p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th><FormattedMessage id="admin.filterByCategory.product.title" defaultMessage="Título" /></th>
              <th><FormattedMessage id="admin.filterByCategory.product.price" defaultMessage="Preço" /></th>
              <th><FormattedMessage id="admin.filterByCategory.product.actions" defaultMessage="Ações" /></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.price}€</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn-card tabela-btn btn-info"
                    onClick={() => {
                      setProduct(product);
                      setProductToEdit(product);
                    }}
                    disabled={!PRODUCT_STATES.isActive(PRODUCT_STATES.fromStatus(product.productState)?.id)}
                  >
                    <FormattedMessage id="admin.filterByCategory.product.edit" defaultMessage="Editar" />
                  </button>

                  <button
                    className="btn-card tabela-btn btn-danger"
                    onClick={() => handleSuspendProduct(product, product.id)}
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
                    onClick={() => handleDeleteProduct(product, product.id)}
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
      )}

      {productToEdit && (
        <Modal
          isOpen={!!productToEdit}
          onClose={() => setProductToEdit(null)}
          title={intl.formatMessage({ id: 'productDetails.modalTitle', defaultMessage: 'Editar Produto' })}
        >
          <EditProductForm
            onSave={(updatedProduct) => {
              setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
              setProductToEdit(null);
            }}
            onCancel={() => setProductToEdit(null)}
          />
        </Modal>
      )}
    </Modal>
  );
}

export default ProductFilter;
