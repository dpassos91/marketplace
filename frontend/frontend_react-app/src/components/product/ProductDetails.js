import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import EditProductForm from './EditProductForm';
import { productAPI } from '../../api/productAPI.js';
import { PRODUCT_STATES } from '../product/productStates.js';
import useAuthStore from '../../stores/authStore.js';
import useProductStore from '../../stores/productStore.js';
import Modal from '../commons/Modal.js';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { product, setProduct } = useProductStore();
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal
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
                    alert('Produto não encontrado!');
                    navigate('/');
                    return;
                }
                setProduct(productData);
            } catch (error) {
                console.error('Erro ao carregar detalhes do produto:', error);
                alert('Erro ao carregar detalhes do produto. Por favor, tente novamente.');
            }
        }
        fetchProductDetails();
    }, [id, navigate, setProduct]);

    const handleSaveProduct = async (updatedProduct) => {
        try {
            await productAPI.updateProduct(updatedProduct.id, updatedProduct);
            setProduct(updatedProduct);
            closeModal(); // Fecha o modal após salvar
            alert('Produto atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            alert('Erro ao atualizar produto. Por favor, tente novamente.');
        }
    };

    const handleDeleteProduct = async () => {
        if (window.confirm('Tem certeza que deseja eliminar este produto?')) {
            try {
                await productAPI.softDeleteProduct(product.id);
                alert('Produto eliminado com sucesso!');
                navigate('/');
            } catch (error) {
                console.error('Erro ao eliminar produto:', error);
                alert('Erro ao eliminar produto. Por favor, tente novamente.');
            }
        }
    };

    const handleComprar = async () => {
        try {
            if (!user) {
                alert('Precisa de iniciar sessão para comprar produtos.');
                navigate('/login');
                return;
            }

            if (user.id === product.sellerId) {
                alert('Não pode comprar o seu próprio produto.');
                return;
            }

            const productState = PRODUCT_STATES.fromDescription(product.status);
            if (!productState || productState.id !== PRODUCT_STATES.DISPONIVEL.id) {
                alert('Este produto não está disponível para compra.');
                return;
            }

            const confirmPurchase = window.confirm('Tem certeza que deseja comprar este produto?');
            if (!confirmPurchase) return;

            setIsBuying(true);

            await productAPI.purchaseProduct(product.id, user.id);

            const updatedProduct = {
                ...product,
                status: PRODUCT_STATES.COMPRADO.description
            };
            setProduct(updatedProduct);

            alert('Produto comprado com sucesso!');
        } catch (error) {
            console.error('Erro ao comprar produto:', error);

            let errorMessage = 'Erro ao processar a compra. Tente novamente.';
            if (error.response) {
                if (error.response.data.includes('not available')) {
                    errorMessage = 'Produto já não está disponível';
                } else if (error.response.data.includes('own product')) {
                    errorMessage = 'Não pode comprar seu próprio produto';
                }
            }

            alert(errorMessage);
        } finally {
            setIsBuying(false);
        }
    };
// Função para abrir o modal
const openModal = () => {
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

    if (!product) {
        return <p>Carregando detalhes do produto...</p>;
    }

    return (
        <div className="detalhes-container">
            <div className="imagem">
                <img src={product.imageUrl} alt={product.title} />
            </div>
            <div id="detalhes-produto-form">
                <h2>{product.title}</h2>
                <p><strong>Localização:</strong> {product.location}</p>
                <p><strong>Categoria:</strong> {product.categoryName}</p>
                <p><strong>Preço:</strong> {parseFloat(product.price).toFixed(2)}€</p>
                <p><strong>Publicado por:</strong> {product.sellerUsername}</p>
                <p><strong>Descrição:</strong> {product.description}</p>
                <p><strong>Data de publicação:</strong> {new Date(product.date).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {product.status}</p>
                <Link
                    to={user ? `/profile/${product.sellerId}` : '#'}
                    className="seller-profile-link"
                    title="Ver perfil do vendedor"
                    onClick={(e) => {
                        if (!user) {
                            e.preventDefault();
                            alert('Só pode aceder a este perfil se for membro da nossa comunidade. Registe-se e/ou faça login!');
                            navigate('/login');
                        }
                    }}
                >
                    <i className="fa fa-user" aria-hidden="true"></i> Ver perfil do vendedor
                </Link>
                {console.log('Seller ID:', product.sellerId)}

                <section className="detalhes-form-buttons">
                    {canBuy && (
                        <button
                            id="comprar-produto"
                            type="button"
                            title="Comprar"
                            onClick={handleComprar}
                            disabled={isBuying}
                        >
                            {isBuying ? (
                                <>
                                    A processar... <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                                </>
                            ) : (
                                <>
                                    Comprar <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                                </>
                            )}
                        </button>
                    )}

                    {canEditOrDelete && (
                        <>
                            <button
                                id="editar-produto"
                                type="button"
                                title="Editar Produto"
                                onClick={openModal} // Abre o modal ao clicar em Editar
                            >
                                Editar <i className="fa fa-pencil" aria-hidden="true"></i>
                            </button>
                            <button
                                id="eliminar-produto"
                                type="button"
                                title="Eliminar Produto"
                                onClick={handleDeleteProduct}
                            >
                                Eliminar <i className="fa fa-times" aria-hidden="true"></i>
                            </button>
                        </>
                    )}
                </section>
            </div>
            {/* Renderiza o Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Editar Produto">
                <EditProductForm
                    onSave={handleSaveProduct}
                    onCancel={closeModal} // Passa a função closeModal para cancelar
                />
            </Modal>
        </div>
    );
}

export default ProductDetails;

