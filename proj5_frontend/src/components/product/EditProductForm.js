import React, { useState, useEffect } from 'react';
import { useFormInput } from '../../hooks/useFormInput.js';
import { categoryAPI } from '../../api/categoryAPI.js';
import { PRODUCT_STATES } from '../../components/product/productStates.js';
import useProductStore from '../../stores/productStore.js';
import { useIntl } from 'react-intl';

function EditProductForm({ onSave, onCancel }) {
    const intl = useIntl();
    const { product } = useProductStore();
    const [categories, setCategories] = useState([]);
    const [editedProduct, handleInputChange, setEditedProduct] = useFormInput(product);

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

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
        setEditedProduct(prev => ({
            ...prev,
            categoryId: parseInt(e.target.value),
            categoryName: selectedCategory?.name || ''
        }));
    };

    const handleStateChange = (e) => {
        const statusText = e.target.value;
        const state = PRODUCT_STATES.fromDescription(statusText);

        if (!state) {
            console.error('Invalid product state:', statusText);
            alert(intl.formatMessage({ id: 'editProductForm.invalidState', defaultMessage: 'Estado do produto inválido!' }));
            return;
        }

        setEditedProduct(prev => ({
            ...prev,
            status: state.description,
            estadoById: state.id        
        }));
    };

    const handleSave = async () => {
        console.log("Produto antes de salvar:", editedProduct);
        try {
            await onSave(editedProduct);
            console.log('Produto salvo:', editedProduct);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div id="detalhes-produto-form">
            <h2>
                <input
                    type="text"
                    name="title"
                    value={editedProduct.title}
                    onChange={handleInputChange}
                    placeholder={intl.formatMessage({ id: 'editProductForm.titlePlaceholder', defaultMessage: 'Digite o título do produto' })}
                />
            </h2>
            <p>
                <strong>{intl.formatMessage({ id: 'editProductForm.location', defaultMessage: 'Localização:' })}</strong>
                <input
                    type="text"
                    name="location"
                    value={editedProduct.location}
                    onChange={handleInputChange}
                    placeholder={intl.formatMessage({ id: 'editProductForm.locationPlaceholder', defaultMessage: 'Digite a localização do produto' })}
                />
            </p>
            <p>
                <strong>{intl.formatMessage({ id: 'editProductForm.category', defaultMessage: 'Categoria:' })}</strong>
                <select
                    name="categoryId"
                    value={editedProduct.categoryId}
                    onChange={handleCategoryChange}
                >
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </p>
            <p>
                <strong>{intl.formatMessage({ id: 'editProductForm.price', defaultMessage: 'Preço:' })}</strong>
                <input
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleInputChange}
                    placeholder={intl.formatMessage({ id: 'editProductForm.pricePlaceholder', defaultMessage: 'Digite o preço do produto' })}
                />
            </p>
            <p><strong>{intl.formatMessage({ id: 'editProductForm.seller', defaultMessage: 'Publicado por:' })}</strong> {editedProduct.sellerUsername}</p>
            <p>
                <strong>{intl.formatMessage({ id: 'editProductForm.description', defaultMessage: 'Descrição:' })}</strong>
                <textarea
                    name="description"
                    value={editedProduct.description}
                    onChange={handleInputChange}
                    placeholder={intl.formatMessage({ id: 'editProductForm.descriptionPlaceholder', defaultMessage: 'Digite a descrição do produto' })}
                />
            </p>
            <p>
                <strong>{intl.formatMessage({ id: 'editProductForm.status', defaultMessage: 'Estado:' })}</strong>
                <select
                    name="status"
                    value={editedProduct.status}
                    onChange={handleStateChange}
                    disabled={editedProduct.status === PRODUCT_STATES.COMPRADO.description}
                >
                    {Object.values(PRODUCT_STATES)
                        .filter(state => state.id !== PRODUCT_STATES.INATIVO.id)
                        .map(state => (
                            <option key={state.id} value={state.description}>
                                {intl.formatMessage({ id: `editProductForm.state.${state.id}`, defaultMessage: state.description })}
                            </option>
                        ))}
                </select>
            </p>
            <section className="detalhes-form-buttons">
                <button type="button" onClick={handleSave}>
                    {intl.formatMessage({ id: 'editProductForm.save', defaultMessage: 'Salvar' })} <i className="fa fa-save" aria-hidden="true"></i>
                </button>
                <button type="button" onClick={onCancel}>
                    {intl.formatMessage({ id: 'editProductForm.cancel', defaultMessage: 'Cancelar' })} <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </section>
        </div>
    );
}

export default EditProductForm;


