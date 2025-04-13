import React, { useState, useEffect } from 'react';
import Modal from '../commons/Modal';
import EditProductForm from '../product/EditProductForm';
import { apiConfig } from '../../api/apiConfig';
import { FormattedMessage, useIntl } from 'react-intl';
import { productAPI } from '../../api/productAPI';
import useProductStore from '../../stores/productStore';

const { apiCall, API_ENDPOINTS } = apiConfig;

function FilterProductsByCategory({ isOpen, onClose }) {
  const intl = useIntl();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

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
        const availableProducts = data.filter((product) => product.status !== 2);
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
      try {
        await apiCall(API_ENDPOINTS.products.deactivate(productId));
        alert(
          intl.formatMessage(
            {
              id: 'admin.filterByCategory.alert.success.deleteProduct',
              defaultMessage: 'Produto "{name}" eliminado com sucesso!'
            },
            { name: product.title }
          )
        );

        const data = await apiCall(API_ENDPOINTS.products.byCategory(selectedCategory));
        const availableProducts = data.filter((p) => p.status !== 4);
        setProducts(availableProducts);
      } catch (error) {
        console.error(error);
        alert(
          intl.formatMessage({
            id: 'admin.filterByCategory.alert.error.deleteProduct',
            defaultMessage: 'Erro ao eliminar o produto. Tente novamente.'
          })
        );
      }
    }
  };

  const handleSuspendProduct = async (product, productId) => {
    const confirmed = window.confirm(
      intl.formatMessage(
        {
          id: 'admin.filterByCategory.window.confirm.suspendProduct',
          defaultMessage: 'Tem certeza de que deseja suspender o produto "{name}"?'
        },
        { name: product.title }
      )
    );

    if (confirmed) {
      try {
        await apiCall(API_ENDPOINTS.products.softDeleteProduct(productId));
        alert(
          intl.formatMessage(
            {
              id: 'admin.filterByCategory.alert.success.suspendProduct',
              defaultMessage: 'Produto "{name}" suspenso com sucesso!'
            },
            { name: product.title }
          )
        );

        const data = await apiCall(API_ENDPOINTS.products.byCategory(selectedCategory));
        const availableProducts = data.filter((p) => p.status !== 4);
        setProducts(availableProducts);
      } catch (error) {
        console.error(error);
        alert(
          intl.formatMessage({
            id: 'admin.filterByCategory.alert.error.suspendProduct',
            defaultMessage: 'Erro ao suspender produto. Tente novamente.'
          })
        );
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
                    >
                      <FormattedMessage id="admin.filterByCategory.product.suspend" defaultMessage="Suspender" />
                    </button>
                    <button
                      className="btn-card tabela-btn btn-edit"
                      onClick={() => handleDeleteProduct(product, product.id)}
                    >
                      <FormattedMessage id="admin.filterByCategory.product.delete" defaultMessage="Eliminar" />
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

