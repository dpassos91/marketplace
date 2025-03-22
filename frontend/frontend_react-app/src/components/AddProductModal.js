import React from 'react';
import { productComponents } from './productComponents'; // Adjust path as needed
import { productAPI } from '../api/productAPI';
import useAuthStore from '../stores/authStore';
import { PRODUCT_STATES } from '../api/productStates';

const { ProductForm } = productComponents;

function AddProductModal({ isOpen, onClose }) {
    const user = useAuthStore((state) => state.user);

    if (!isOpen) return null;

    const handleSave = async (productData) => {
        try {
            if (!user || !user.id) {
                throw new Error('You must be logged in to add a product');
            }

            const productToSave = {
                ...productData,
                sellerId: user.id,
                estadoById: PRODUCT_STATES.DISPONIVEL.id,
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
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Product</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ProductForm onSave={handleSave} onCancel={handleCancel} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProductModal;

