import React from 'react';
import Modal from '../commons/Modal';
import ProductForm from './ProductForm';
import { productAPI } from '../../api/productAPI';
import useAuthStore from '../../stores/authStore';
import { PRODUCT_STATES } from '../../components/product/productStates';
import { useIntl } from 'react-intl';  // Importe o useIntl para usar o formatMessage

function AddProductModal({ isOpen, onClose }) {
    const intl = useIntl();
    const user = useAuthStore((state) => state.user);

    const handleSave = async (productData) => {
        try {
            if (!user || !user.id) {
                throw new Error(intl.formatMessage({ id: 'addProduct.error.loginRequired', defaultMessage: 'Faça login antes de adicionar um produto!' }));
            }

            const productToSave = {
                ...productData,
                sellerId: user.id,
                estadoById: PRODUCT_STATES.DISPONIVEL.id,
                active: true, // Definir o produto como ativo por padrão
            };

            await productAPI.createProduct(productToSave);
            alert(intl.formatMessage({ id: 'addProduct.success', defaultMessage: 'Produto criado com sucesso!' }));
        } catch (error) {
            alert(intl.formatMessage({ id: 'addProduct.error.creatingProduct', defaultMessage: 'Erro ao criar produto. Por favor, tente novamente.' }));
        } finally {
            onClose();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={intl.formatMessage({ id: 'addProduct.title', defaultMessage: 'Adicionar Novo Produto' })}>
            <ProductForm onSave={handleSave} onCancel={handleCancel} />
        </Modal>
    );
}

export default AddProductModal;


