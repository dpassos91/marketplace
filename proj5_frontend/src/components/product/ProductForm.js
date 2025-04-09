import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../api/categoryAPI';
import { useIntl } from 'react-intl'; // Importe o useIntl

function ProductForm({ initialProduct, onSave, onCancel }) {
    const intl = useIntl(); // Inicializa o useIntl
    const [product, setProduct] = useState(initialProduct || {
        title: '',
        description: '',
        categoryId: '',
        price: '',
        imageUrl: '',
        location: '',
    });
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await categoryAPI.getAllCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error(intl.formatMessage({ id: 'productForm.error.loadingCategories', defaultMessage: 'Erro ao carregar as categorias:' }), error);
            }
        };
        fetchCategories();
    }, [intl]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert(intl.formatMessage({ id: 'productForm.error.validateForm', defaultMessage: 'Por favor preencha todos os campos corretamente.' }));
            return;
        }

        setIsSubmitting(true);
        try {
            const productToSave = {
                ...product,
                price: parseFloat(product.price),
                categoryId: parseInt(product.categoryId),
            };

            await onSave(productToSave);
        } catch (error) {
            console.error(intl.formatMessage({ id: 'productForm.error.creatingProduct', defaultMessage: 'Erro a criar produto:' }), error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        return (
            product.title &&
            product.description &&
            product.location &&
            product.categoryId &&
            product.price &&
            !isNaN(parseFloat(product.price)) &&
            parseFloat(product.price) > 0
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleInputChange}
                placeholder={intl.formatMessage({ id: 'productForm.placeholder.title', defaultMessage: 'Título' })}
                required
            />
            <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder={intl.formatMessage({ id: 'productForm.placeholder.description', defaultMessage: 'Descrição' })}
                required
            />
            <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleInputChange}
                required
            >
                <option value="">{intl.formatMessage({ id: 'productForm.option.selectCategory', defaultMessage: 'Selecione uma categoria' })}</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                placeholder={intl.formatMessage({ id: 'productForm.placeholder.price', defaultMessage: 'Preço' })}
                min="0"
                step="0.01"
                required
            />
            <input
                type="text"
                name="imageUrl"
                value={product.imageUrl}
                onChange={handleInputChange}
                placeholder={intl.formatMessage({ id: 'productForm.placeholder.imageUrl', defaultMessage: 'Imagem URL' })}
            />
            <input
                type="text"
                name="location"
                value={product.location}
                onChange={handleInputChange}
                placeholder={intl.formatMessage({ id: 'productForm.placeholder.location', defaultMessage: 'Localização' })}
                required
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? intl.formatMessage({ id: 'productForm.button.processing', defaultMessage: 'Processing...' }) : intl.formatMessage({ id: 'productForm.button.addProduct', defaultMessage: 'Adicionar produto' })}
            </button>
            {onCancel && (
                <button type="button" onClick={onCancel}>
                    {intl.formatMessage({ id: 'productForm.button.cancel', defaultMessage: 'Cancelar' })}
                </button>
            )}
        </form>
    );
}

export default ProductForm;

