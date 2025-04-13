import React, { useState, useEffect } from 'react';
import Modal from '../commons/Modal';
import EditProductForm from '../product/EditProductForm';
import { apiConfig } from '../../api/apiConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import { productAPI } from '../../api/productAPI';
import useProductStore from '../../stores/productStore';
import SpinnerLeaf from '../commons/SpinnerLeaf';
import { PRODUCT_STATES } from '../product/productStates';


const { apiCall, API_ENDPOINTS } = apiConfig;

function FilterProductsByCategory({ isOpen, onClose }) {
  const intl = useIntl();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [suspendingProductId, setSuspendingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);


  const { setProduct } = useProductStore();

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const data = await apiCall(API_ENDPOINTS.categories.all);
          setCategories(data);
        } catch (error) {
          console.error(
            intl.formatMessage({
              id: 'admin.filterByCategory.error.loadCategories',
              defaultMessage: 'Erro ao carregar categorias'
            }),
            error
          );
        }
      };

      fetchCategories();
    }
  }, [isOpen, intl]);

  const handleCategoryChange = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
  
    if (categoryId) {
      try {
        const data = await apiCall(API_ENDPOINTS.products.byCategory(categoryId));
        // ⚠️ Aqui filtramos os produtos que NÃO estão nos estados 4 ou 5
        const availableProducts = data.filter((product) => {
          const state = PRODUCT_STATES.fromStatus(product.productState);
          return state && PRODUCT_STATES.isActive(state.id) && state.id !== PRODUCT_STATES.COMPRADO.id;
        });
        setProducts(availableProducts);
      } catch (error) {
        console.error(
          intl.formatMessage({
            id: 'admin.filterByCategory.error.loadProducts',
            defaultMessage: 'Erro ao buscar produtos'
          }),
          error
        );
      }
    } else {
      // Se não houver categoria selecionada, limpa a lista
      setProducts([]);
    }
  };
  

  const handleSuspendProduct = async (product, productId) => {
    const confirmed = window.confirm(
      intl.formatMessage(
        {
          id: 'admin.filterByCategory.window.confirm.suspendProduct',
          defaultMessage: 'Tem certeza de que deseja suspender o produto {name}?'
        },
        { name: product.title }
      )
    );
  
    if (confirmed) {
      setSuspendingProductId(productId); // ⬅️ Ativa o loading no botão
  
      try {
        await productAPI.softDeleteProduct(productId);
        alert(
          intl.formatMessage(
            {
              id: 'admin.filterByCategory.alert.success.suspendProduct',
              defaultMessage: 'Produto {name} suspenso com sucesso!'
            },
            { name: product.title }
          )
        );
  
        // Atualiza a lista excluindo produtos inativos (suspensos) ou comprados (state 4 e 5)
        const data = await apiCall(API_ENDPOINTS.products.byCategory(selectedCategory));
        const availableProducts = data.filter((product) => {
          const state = PRODUCT_STATES.fromStatus(product.productState);
          return state && PRODUCT_STATES.isActive(state.id) && state.id !== PRODUCT_STATES.COMPRADO.id;
        });
        setProducts(availableProducts);
      } catch (error) {
        console.error(error);
        alert(
          intl.formatMessage({
            id: 'admin.filterByCategory.alert.error.suspendProduct',
            defaultMessage: 'Erro ao suspender produto. Tente novamente.'
          })
        );
      } finally {
        setSuspendingProductId(null); // ⬅️ Termina o loading
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
      setDeletingProductId(productId); // ⬅️ Ativa o loading
  
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
  
        const data = await apiCall(API_ENDPOINTS.products.byCategory(selectedCategory));
        const availableProducts = data.filter((product) => {
          const state = PRODUCT_STATES.fromStatus(product.productState);
          return state && PRODUCT_STATES.isActive(state.id) && state.id !== PRODUCT_STATES.COMPRADO.id;
        });
        setProducts(availableProducts);
      } catch (error) {
        console.error(error);
        alert(
          intl.formatMessage({
            id: 'admin.filterByCategory.alert.error.deleteProduct',
            defaultMessage: 'Erro ao eliminar o produto. Tente novamente.'
          })
        );
      } finally {
        setDeletingProductId(null); // ⬅️ Termina o loading
      }
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({
        id: 'admin.filterByCategory.title',
        defaultMessage: 'Filtrar por Categoria'
      })}
    >
      <div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">
            {intl.formatMessage({
              id: 'admin.filterByCategory.select',
              defaultMessage: 'Selecione uma categoria'
            })}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="admin.filterByCategory.product.title" defaultMessage="Título" />
                </th>
                <th>
                  <FormattedMessage id="admin.filterByCategory.product.price" defaultMessage="Preço" />
                </th>
                <th>
                  <FormattedMessage id="admin.filterByCategory.product.actions" defaultMessage="Ações" />
                </th>
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
  disabled={product.state === 4 || product.state === 5} // Desativa se já estiver inativo
  onClick={() => {
    setProduct(product);
    setProductToEdit(product);
  }}
>
  <FormattedMessage id="admin.filterByCategory.product.edit" defaultMessage="Editar" />
</button>

<button
  className="btn-card tabela-btn btn-danger"
  onClick={() => handleSuspendProduct(product, product.id)}
  disabled={suspendingProductId === product.id || product.state === 4 || product.state === 5}
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
      </div>

      {productToEdit && (
        <Modal
          isOpen={!!productToEdit}
          onClose={() => setProductToEdit(null)}
          title={intl.formatMessage({
            id: 'productDetails.modalTitle',
            defaultMessage: 'Editar Produto'
          })}
        >
          <EditProductForm
            onSave={async (updatedProduct) => {
              try {
                await productAPI.updateProduct(updatedProduct.id, updatedProduct);
                alert(intl.formatMessage({
                  id: 'productDetails.alert.productUpdateSuccess',
                  defaultMessage: 'Produto atualizado com sucesso!'
                }));

                setProducts((prev) =>
                  prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
                );

                setProductToEdit(null);
              } catch (error) {
                console.error('Erro ao atualizar produto:', error);
                alert(intl.formatMessage({
                  id: 'productDetails.alert.productUpdateError',
                  defaultMessage: 'Erro ao atualizar produto. Por favor, tente novamente.'
                }));
              }
            }}
            onCancel={() => setProductToEdit(null)}
          />
        </Modal>
      )}
    </Modal>
  );
}

export default FilterProductsByCategory;

