// AddProductModal.js
import React from 'react';
import Modal from '../commons/Modal';
import ProductForm from './ProductForm';
import { productAPI } from '../../api/productAPI';
import useAuthStore from '../../stores/authStore';
import { PRODUCT_STATES } from '../../components/product/productStates';

function AddProductModal({ isOpen, onClose }) {
    const user = useAuthStore((state) => state.user);

    const handleSave = async (productData) => {
        try {
            if (!user || !user.id) {
                throw new Error('You must be logged in to add a product');
            }

            const productToSave = {
                ...productData,
                sellerId: user.id,
                estadoById: PRODUCT_STATES.DISPONIVEL.id,
                active: true, // Definir o produto como ativo por padrão
            };

            await productAPI.createProduct(productToSave);
            alert('Product saved successfully!');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Please try again.');
        } finally {
            onClose();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Novo Produto">
            <ProductForm onSave={handleSave} onCancel={handleCancel} />
        </Modal>
    );
}

export default AddProductModal;

