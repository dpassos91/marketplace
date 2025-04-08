import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import EditProductForm from './EditProductForm';
import { productAPI } from '../../api/productAPI.js';
import { PRODUCT_STATES } from '../product/productStates.js';
import useAuthStore from '../../stores/authStore.js';
import useProductStore from '../../stores/productStore.js';
import Modal from '../commons/Modal.js';

function ProductDetails() {
    const { formatMessage } = useIntl();
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { product, setProduct } = useProductStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    const isOwner = user && product && user.id === product.sellerId;
    const canBuy = user && !isOwner;

    const canEditOrDelete = user && (
        (isOwner && product.status !== PRODUCT_STATES.COMPRADO.description && product.status !== PRODUCT_STATES.INATIVO.description) ||
        user.isAdmin === true
    );

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const productData = await productAPI.getProductById(id);
                if (!productData) {
                    alert(formatMessage({ id: 'productDetails.alert.productNotFound', defaultMessage: 'Produto não encontrado!' }));
                    navigate('/');
                    return;
                }
                setProduct(productData);
            } catch (error) {
                console.error('Erro ao carregar detalhes do produto:', error);
                alert(formatMessage({ id: 'productDetails.alert.productNotLoaded', defaultMessage: 'Erro ao carregar detalhes do produto. Por favor, tente novamente.' }));
            }
        }
        fetchProductDetails();
    }, [id, navigate, setProduct, formatMessage]);

    const handleSaveProduct = async (updatedProduct) => {
        try {
            await productAPI.updateProduct(updatedProduct.id, updatedProduct);
            setProduct(updatedProduct);
            closeModal();
            alert(formatMessage({ id: 'productDetails.alert.productUpdateSuccess', defaultMessage: 'Produto atualizado com sucesso!' }));
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            alert(formatMessage({ id: 'productDetails.alert.productUpdateError', defaultMessage: 'Erro ao atualizar produto. Por favor, tente novamente.' }));
        }
    };

    const handleDeleteProduct = async () => {
        if (window.confirm(formatMessage({ id: 'productDetails.window.confirmDelete', defaultMessage: 'Tem certeza que deseja eliminar este produto?' }))) {
            try {
                await productAPI.softDeleteProduct(product.id);
                alert(formatMessage({ id: 'productDetails.alert.productDeleteSuccess', defaultMessage: 'Produto eliminado com sucesso!' }));
                navigate('/');
            } catch (error) {
                console.error('Erro ao eliminar produto:', error);
                alert(formatMessage({ id: 'productDetails.alert.productDeleteError', defaultMessage: 'Erro ao eliminar produto. Por favor, tente novamente.' }));
            }
        }
    };

    const handleComprar = async () => {
        try {
            if (!user) {
                alert(formatMessage({ id: 'productDetails.alert.loginRequired', defaultMessage: 'Precisa de iniciar sessão para comprar produtos.' }));
                navigate('/login');
                return;
            }

            if (user.id === product.sellerId) {
                alert(formatMessage({ id: 'productDetails.alert.ownProduct', defaultMessage: 'Não pode comprar o seu próprio produto.' }));
                return;
            }

            const productState = PRODUCT_STATES.fromDescription(product.status);
            if (!productState || productState.id !== PRODUCT_STATES.DISPONIVEL.id) {
                alert(formatMessage({ id: 'productDetails.alert.notAvailable', defaultMessage: 'Este produto não está disponível para compra.' }));
                return;
            }

            const confirmPurchase = window.confirm(
                formatMessage({ id: 'productDetails.window.confirmPurchase', defaultMessage: 'Tem certeza que deseja comprar este produto?' })
            );
            if (!confirmPurchase) return;

            setIsBuying(true);

            await productAPI.purchaseProduct(product.id, user.id);

            const updatedProduct = {
                ...product,
                status: PRODUCT_STATES.COMPRADO.description
            };
            setProduct(updatedProduct);

            alert(formatMessage({ id: 'productDetails.alert.purchaseSuccess', defaultMessage: 'Produto comprado com sucesso!' }));
        } catch (error) {
            console.error('Erro ao comprar produto:', error);

            let errorMessage = formatMessage({ id: 'productDetails.alert.purchaseError', defaultMessage: 'Erro ao processar a compra. Tente novamente.' });
            if (error.response) {
                if (error.response.data.includes('not available')) {
                    errorMessage = formatMessage({ id: 'productDetails.alert.notAvailable', defaultMessage: 'Produto já não está disponível' });
                } else if (error.response.data.includes('own product')) {
                    errorMessage = formatMessage({ id: 'productDetails.alert.ownProduct', defaultMessage: 'Não pode comprar seu próprio produto' });
                }
            }

            alert(errorMessage);
        } finally {
            setIsBuying(false);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (!product) {
        return <p><FormattedMessage id="productDetails.loading" defaultMessage="Carregando detalhes do produto..." /></p>;
    }

    return (
        <div className="detalhes-container">
            <div className="imagem">
                <img src={product.imageUrl} alt={product.title} />
            </div>
            <div id="detalhes-produto-form">
                <h2>{product.title}</h2>
                <p><strong><FormattedMessage id="productDetails.location" defaultMessage="Localização:" /></strong> {product.location}</p>
                <p><strong><FormattedMessage id="productDetails.category" defaultMessage="Categoria:" /></strong> {product.categoryName}</p>
                <p><strong><FormattedMessage id="productDetails.price" defaultMessage="Preço:" /></strong> {parseFloat(product.price).toFixed(2)}€</p>
                <p><strong><FormattedMessage id="productDetails.seller" defaultMessage="Publicado por:" /></strong> {product.sellerUsername}</p>
                <p><strong><FormattedMessage id="productDetails.description" defaultMessage="Descrição:" /></strong> {product.description}</p>
                <p><strong><FormattedMessage id="productDetails.date" defaultMessage="Data de publicação:" /></strong> {new Date(product.date).toLocaleDateString()}</p>
                <p><strong><FormattedMessage id="productDetails.status" defaultMessage="Estado:" /></strong> {product.status}</p>

                <Link
                    to={user ? `/profile/${product.sellerId}` : '#'}
                    className="seller-profile-link"
                    title={formatMessage({ id: 'productDetails.viewSellerProfile', defaultMessage: 'Ver perfil do vendedor' })}
                    onClick={(e) => {
                        if (!user) {
                            e.preventDefault();
                            alert(formatMessage({ id: 'productDetails.alert.mustBeLoggedInToViewProfile', defaultMessage: 'Só pode aceder a este perfil se for membro da nossa comunidade. Registe-se e/ou faça login!' }));
                            navigate('/login');
                        }
                    }}
                >
                    <i className="fa fa-user" aria-hidden="true"></i> <FormattedMessage id="productDetails.viewSellerProfile" defaultMessage="Ver perfil do vendedor" />
                </Link>

                <section className="detalhes-form-buttons">
                    {canBuy && (
                        <button
                            id="comprar-produto"
                            type="button"
                            title={formatMessage({ id: 'productDetails.button.buy', defaultMessage: 'Comprar' })}
                            onClick={handleComprar}
                            disabled={isBuying}
                        >
                            {isBuying ? (
                                <>
                                    <FormattedMessage id="productDetails.button.processing" defaultMessage="A processar..." /> <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                </>
                            ) : (
                                <>
                                    <FormattedMessage id="productDetails.button.buy" defaultMessage="Comprar" /> <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                </>
                            )}
                        </button>
                    )}

                    {canEditOrDelete && (
                        <>
                            <button
                                id="editar-produto"
                                type="button"
                                title={formatMessage({ id: 'productDetails.button.edit', defaultMessage: 'Editar Produto' })}
                                onClick={openModal}
                            >
                                <FormattedMessage id="productDetails.button.edit" defaultMessage="Editar" /> <i className="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                            <button
                                id="eliminar-produto"
                                type="button"
                                title={formatMessage({ id: 'productDetails.button.delete', defaultMessage: 'Eliminar Produto' })}
                                onClick={handleDeleteProduct}
                            >
                                <FormattedMessage id="productDetails.button.delete" defaultMessage="Eliminar" /> <i className="fa fa-times" aria-hidden="true"></i>
                            </button>
                        </>
                    )}
                </section>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={<FormattedMessage id="productDetails.modalTitle" defaultMessage="Editar Produto" />}>
                <EditProductForm
                    onSave={handleSaveProduct}
                    onCancel={closeModal}
                />
            </Modal>
        </div>
    );
}

export default ProductDetails;


