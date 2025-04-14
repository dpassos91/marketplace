import React, { useState, useCallback } from 'react';
import Modal from '../commons/Modal';
import { apiConfig } from '../../api/apiConfig';
import EditProductForm from '../product/EditProductForm';
import { PRODUCT_STATES } from '../product/productStates';
import { useIntl, FormattedMessage } from 'react-intl';
import SpinnerLeaf from '../commons/SpinnerLeaf';
import { productAPI } from '../../api/productAPI';
import './UserTable.css';

const { apiCall, API_ENDPOINTS } = apiConfig;

function FilterProductsBySeller({ isOpen, onClose }) {
  const [sellerId, setSellerId] = useState('');
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [productToEdit, setProductToEdit] = useState(null);
  const [suspendingProductId, setSuspendingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const intl = useIntl();

  const searchSellerProducts = useCallback(async () => {
    if (!sellerId.trim()) {
      setProducts([]);
      setMessage('empty');
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setProducts([]);
    setMessage('');

    try {
      const data = await apiCall(API_ENDPOINTS.products.bySeller(sellerId));
      const availableProducts = data.filter((product) => {
        const state = PRODUCT_STATES.fromStatus(product.productState);
        return state && PRODUCT_STATES.isActive(state.id) && state.id !== PRODUCT_STATES.COMPRADO.id;
      });
      setProducts(availableProducts);
      if (availableProducts.length === 0) {
        setMessage('empty');
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  const handleSuspendProduct = async (product, productId) => {
    const confirmed = window.confirm(
      intl.formatMessage({
        id: 'admin.filterBySeller.window.confirm.suspendProduct',
        defaultMessage: 'Tem certeza de que deseja suspender o produto {name}?'
      }, { name: product.title })
    );

    if (confirmed) {
      setSuspendingProductId(productId);
      try {
        await apiCall(API_ENDPOINTS.products.deactivate(productId));
        alert(
          intl.formatMessage({
            id: 'admin.filterBySeller.alert.success.suspendProduct',
            defaultMessage: 'Produto {name} foi suspenso com sucesso.'
          }, { name: product.title })
        );
        searchSellerProducts();
      } catch (error) {
        console.error('Erro ao suspender produto:', error);
        alert(intl.formatMessage({
          id: 'admin.filterBySeller.alert.error.suspendProduct',
          defaultMessage: 'Erro ao suspender o produto. Tente novamente.'
        }));
      } finally {
        setSuspendingProductId(null);
      }
    }
  };

  const handleDeleteProduct = async (product, productId) => {
    const confirmed = window.confirm(
      intl.formatMessage(
        {
          id: 'admin.filterByCategory.window.confirm.deleteProduct',
          defaultMessage: 'Tem certeza de que deseja eliminar o produto "{name}"?'
        },
        { name: product.title }
      )
    );

    if (confirmed) {
      setDeletingProductId(productId);

      try {
        await productAPI.permanentlyDeleteProduct(productId);
        alert(
          intl.formatMessage(
            {
              id: 'admin.filterByCategory.alert.success.deleteProduct',
              defaultMessage: 'Produto {name} eliminado com sucesso!'
            },
            { name: product.title }
          )
        );

        searchSellerProducts();
      } catch (error) {
        console.error(error);
        alert(
          intl.formatMessage({
            id: 'admin.filterByCategory.alert.error.deleteProduct',
            defaultMessage: 'Erro ao eliminar o produto. Tente novamente.'
          })
        );
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  const handleInvalid = (e) => {
    const message = intl.formatMessage({
      id: 'admin.filterBySeller.error.required',
      defaultMessage: 'Por favor, insira um ID de vendedor'
    });
    e.target.setCustomValidity(message);
  };

  const handleInput = (e) => {
    e.target.setCustomValidity('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={intl.formatMessage({ id: 'admin.filterBySeller.title', defaultMessage: 'Filtrar por Vendedor' })}>
      <form onSubmit={(e) => { e.preventDefault(); searchSellerProducts(); }}>
        <input
          type="text"
          placeholder={intl.formatMessage({ id: 'admin.filterBySeller.placeholder.sellerId', defaultMessage: 'ID do Vendedor' })}
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          required
          onInvalid={handleInvalid}
          onInput={handleInput}
        />
        <button type="submit" className="btn-card tabela-btn btn-success full-width">
          <FormattedMessage id="admin.common.search" defaultMessage="Procurar" />
        </button>
        <button type="button" onClick={onClose} className="btn-card tabela-btn">
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
          <p>
            <FormattedMessage id="admin.productTable.error" defaultMessage="Erro ao carregar produtos." />
          </p>
        </div>
      )}

      {message === 'empty' && (
        <div className="empty-products">
          <img src="/img/sem-produtos.png" alt="Nenhum produto encontrado" />
          <p>
            <FormattedMessage id="admin.productTable.empty" defaultMessage="Nenhum produto encontrado." />
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th><FormattedMessage id="admin.filterBySeller.product.title" defaultMessage="Título" /></th>
              <th><FormattedMessage id="admin.filterBySeller.product.price" defaultMessage="Preço" /></th>
              <th><FormattedMessage id="admin.filterBySeller.product.actions" defaultMessage="Ações" /></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.price}€</td>
                <td style={{ textAlign: 'center' }}>
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
                      <FormattedMessage id="admin.filterBySeller.product.suspend" defaultMessage="Suspender" />
                    )}
                  </button>

                  <button
                    className="btn-card tabela-btn btn-edit"
                    onClick={() => setProductToEdit(product)}
                    disabled={!PRODUCT_STATES.isActive(PRODUCT_STATES.fromStatus(product.productState)?.id)}
                  >
                    <FormattedMessage id="admin.filterBySeller.product.edit" defaultMessage="Editar" />
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
              setProducts((prev) =>
                prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
              );
              setProductToEdit(null);
            }}
            onCancel={() => setProductToEdit(null)}
          />
        </Modal>
      )}
    </Modal>
  );
}

export default FilterProductsBySeller;
