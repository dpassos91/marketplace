import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../commons/Modal';
import EditProductForm from '../product/EditProductForm';
import { apiConfig } from '../../api/apiConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import { productAPI } from '../../api/productAPI';
import useProductStore from '../../stores/productStore';
import { PRODUCT_STATES } from '../product/productStates';
import './UserTable.css';
import ProductFilterSelect from './ProductFilterSelect';
import TableDataState from './TableDataState';
import ProductTable from './ProductTable';

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
    if (selection === 'seller') {
      const delayDebounce = setTimeout(() => {
        if (sellerId.trim() === '') return;
        if (/^\d+$/.test(sellerId.trim())) {
          handleSearch();
        } else {
          setProducts([]);
          setMessage('invalid');
        }
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
      } else if (selection === 'seller' && /^\d+$/.test(sellerId.trim())) {
        data = await apiCall(API_ENDPOINTS.products.bySeller(sellerId));
      } else {
        setLoading(false);
        setMessage('invalid');
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
      <ProductFilterSelect
        selection={selection}
        setSelection={setSelection}
        sellerId={sellerId}
        setSellerId={setSellerId}
        categories={categories}
        onCancel={onClose}
      />

<TableDataState
  loading={loading}
  error={error}
  message={message}
  messagePrefix="admin.filterByCategory"
  image="/img/sem-produtos.png"
/>

      {!loading && !error && products.length > 0 && (
        <ProductTable
          products={products}
          suspendingProductId={suspendingProductId}
          deletingProductId={deletingProductId}
          onSuspend={handleSuspendProduct}
          onDelete={handleDeleteProduct}
          onEdit={(product) => {
            setProduct(product);
            setProductToEdit(product);
          }}
        />
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


