import React, { useState, useEffect } from 'react';
import { useFormInput } from '../../hooks/useFormInput.js';
import { categoryAPI } from '../../api/categoryAPI.js';
import { PRODUCT_STATES } from '../../components/product/productStates.js';
import useProductStore from '../../stores/productStore.js';
import { useIntl } from 'react-intl';

function EditProductForm({ product, onSave, onCancel }) {
  const intl = useIntl();
  const storeProduct = useProductStore((state) => state.product);

  const [categories, setCategories] = useState([]);
  const [editedProduct, handleInputChange, setEditedProduct] = useFormInput({}); // começa vazio

  useEffect(() => {
    const baseProduct = product ?? storeProduct;
    if (!baseProduct) return;
  
    const statusFromSource = baseProduct.status || PRODUCT_STATES.fromStatus(baseProduct.productState)?.status;
  
    const normalizedProduct = {
      ...baseProduct,
      status: statusFromSource,
    };
  
    setEditedProduct(normalizedProduct);
  }, [product, storeProduct, setEditedProduct]);
  

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoryAPI.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleInvalid = (e) => {
    const errorId = `editProductForm.${e.target.name}.errorRequired`;
    e.target.setCustomValidity(intl.formatMessage({ id: errorId }));
  };

  const handleChange = (e) => {
    e.target.setCustomValidity('');
    handleInputChange(e);
  };

  const handleCategoryChange = (e) => {
    e.target.setCustomValidity('');
    const selectedCategory = categories.find(
      (cat) => cat.id === parseInt(e.target.value, 10)
    );
    setEditedProduct((prev) => ({
      ...prev,
      categoryId: parseInt(e.target.value, 10),
      categoryName: selectedCategory?.name || '',
    }));
  };

  const handleStateChange = (e) => {
    e.target.setCustomValidity('');
    const selectedStatus = e.target.value;
    const state = PRODUCT_STATES.fromStatus(selectedStatus);

    if (!state) {
      alert(
        intl.formatMessage({
          id: 'editProductForm.invalidState',
          defaultMessage: 'Estado do produto inválido!',
        })
      );
      return;
    }

    setEditedProduct((prev) => ({
      ...prev,
      status: state.status,
      estadoById: state.id,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await onSave(editedProduct);
      console.log('Produto salvo:', editedProduct);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <input
        type="text"
        name="title"
        value={editedProduct.title}
        onChange={handleChange}
        onInvalid={handleInvalid}
        placeholder={intl.formatMessage({
          id: 'editProductForm.titlePlaceholder',
          defaultMessage: 'Digite o título do produto',
        })}
        required
      />
      <textarea
        name="description"
        value={editedProduct.description}
        onChange={handleChange}
        onInvalid={handleInvalid}
        placeholder={intl.formatMessage({
          id: 'editProductForm.descriptionPlaceholder',
          defaultMessage: 'Digite a descrição do produto',
        })}
        required
      />
      <select
        name="categoryId"
        value={editedProduct.categoryId}
        onChange={handleCategoryChange}
        onInvalid={handleInvalid}
        required
      >
        <option value="">
          {intl.formatMessage({
            id: 'editProductForm.selectCategory',
            defaultMessage: 'Selecione uma categoria',
          })}
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="price"
        value={editedProduct.price}
        onChange={handleChange}
        onInvalid={handleInvalid}
        placeholder={intl.formatMessage({
          id: 'editProductForm.pricePlaceholder',
          defaultMessage: 'Digite o preço do produto',
        })}
        required
      />
      <input
        type="text"
        name="location"
        value={editedProduct.location}
        onChange={handleChange}
        onInvalid={handleInvalid}
        placeholder={intl.formatMessage({
          id: 'editProductForm.locationPlaceholder',
          defaultMessage: 'Digite a localização do produto',
        })}
        required
      />
      <select
        name="status"
        value={editedProduct.status}
        onChange={handleStateChange}
        onInvalid={handleInvalid}
        required
        disabled={editedProduct.status === PRODUCT_STATES.COMPRADO.status}
      >
        {Object.values(PRODUCT_STATES)
          .filter(
            (state) =>
              typeof state === 'object' &&
              state.id &&
              state.id !== PRODUCT_STATES.INATIVO.id
          )
          .map((state) => (
            <option key={state.id} value={state.status}>
              {intl.formatMessage({
                id: state.translationKey,
                defaultMessage: state.defaultText,
              })}
            </option>
          ))}
      </select>
      <button type="submit">
        {intl.formatMessage({
          id: 'editProductForm.save',
          defaultMessage: 'Guardar',
        })}
      </button>
      <button type="button" onClick={onCancel}>
        {intl.formatMessage({
          id: 'editProductForm.cancel',
          defaultMessage: 'Cancelar',
        })}
      </button>
    </form>
  );
}

export default EditProductForm;





