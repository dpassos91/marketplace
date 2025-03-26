// ProductForm.js
import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../../api/categoryAPI';

function ProductForm({ initialProduct, onSave, onCancel }) {
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
                console.error('Error loading categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fill in all required fields with valid values');
            return;
        }

        setIsSubmitting(true);
        try {
            const productToSave = {
                ...product,
                price: parseFloat(product.price),
                categoryId: parseInt(product.categoryId),
            };

            await onSave(productToSave); // Call onSave with validated data
            alert('Product saved successfully!');

        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Please try again.');
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
                placeholder="Título"
                required
            />
            <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Descrição"
                required
            />
            <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleInputChange}
                required
            >
                <option value="">Selecione uma categoria</option>
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
                placeholder="Preço"
                min="0"
                step="0.01"
                required
            />
            <input
                type="text"
                name="imageUrl"
                value={product.imageUrl}
                onChange={handleInputChange}
                placeholder="Imagem URL"
            />
            <input
                type="text"
                name="location"
                value={product.location}
                onChange={handleInputChange}
                placeholder="Localização"
                required
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Adicionar produto'}
            </button>
            {onCancel && (
                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>
            )}
        </form>
    );
}

export default ProductForm;
