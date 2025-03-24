import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useFormInput } from '../hooks/UseFormInput.js';
import { categoryAPI } from '../api/categoryAPI.js';
import { productAPI } from '../api/productAPI.js'; 
import { PRODUCT_STATES } from '../api/productStates.js';
import { categoryComponents } from './categoryComponents.js';
import useAuthStore from '../stores/authStore.js'; // Ajusta o caminho conforme necessário
import useProductStore from '../stores/productStore.js';


// Product Related Components

function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div className="card">
            <img src={product.imageUrl} alt={product.title} />
            <div>
                <h1>{product.title}</h1>
                <h4>{product.location}</h4>
                <h2>{product.categoryName}</h2>
                <span>{parseFloat(product.price).toFixed(2)}€</span>
                <button
                    type="button"
                    title="descricao"
                    onClick={() => navigate(`/detalhes-produto/${product.id}`)}
                >
                    Saber mais
                </button>
            </div>
        </div>
    );
}

function ProductList() {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams();

    useEffect(() => {
        async function fetchProducts() {
            const allProducts = await productAPI.getAllActiveProducts();
            if (categoryId) {
                const categoryComponent = await import('./categoryComponents.js');
                const filteredProducts = await categoryComponent.displayProductsByCategory(allProducts, categoryId);
                setProducts(filteredProducts);
            } else {
                setProducts(allProducts);
            }
        }
        fetchProducts();
    }, [categoryId]);

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function RecentProducts() {
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        async function fetchRecentProducts() {
            const products = await productAPI.getAllActiveProducts();
            const mostRecent = products
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 3);
            setRecentProducts(mostRecent);
        }
        fetchRecentProducts();
    }, []);

    return (
        <div className="recent-products">
            {recentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { product, setProduct } = useProductStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    // Verifica se o usuário é o proprietário ou admin
    const isOwner = user && product && user.id === product.sellerId;
    const canBuy = user && !isOwner;
    const canEditOrDelete = user && (isOwner || user.isAdmin === true);

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
            setIsEditing(false);
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

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleComprar = async () => {
        try {
            if (!user) {
                alert('Precisa de iniciar sessão para comprar produtos.');
                navigate('/login');
                return;
            }

            // Verificar se é o dono do produto
            if (user.id === product.sellerId) {
                alert('Não pode comprar o seu próprio produto.');
                return;
            }

            // Verificar disponibilidade
            const productState = PRODUCT_STATES.fromDescription(product.status);
            if (!productState || productState.id !== PRODUCT_STATES.DISPONIVEL.id) {
                alert('Este produto não está disponível para compra.');
                return;
            }

            // Confirmação da compra
            const confirmPurchase = window.confirm('Tem certeza que deseja comprar este produto?');
            if (!confirmPurchase) return;

            setIsBuying(true);
            
            // Chamar API de compra
            await productAPI.purchaseProduct(product.id, user.id);
            
            // Atualizar estado do produto
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

    if (!product) {
        return <p>Carregando detalhes do produto...</p>;
    }

    return (
        <div className="detalhes-container">
            <div className="imagem">
                <img src={product.imageUrl} alt={product.title} />
            </div>
            {isEditing ? (
                <EditProductForm
                    onSave={handleSaveProduct}
                    onCancel={handleCancel}
                />
            ) : (
                <div id="detalhes-produto-form">
                    <h2>{product.title}</h2>
                    <p><strong>Localização:</strong> {product.location}</p>
                    <p><strong>Categoria:</strong> {product.categoryName}</p>
                    <p><strong>Preço:</strong> {parseFloat(product.price).toFixed(2)}€</p>
                    <p><strong>Publicado por:</strong> {product.sellerUsername}</p>
                    <p><strong>Descrição:</strong> {product.description}</p>
                    <p><strong>Estado:</strong> {product.status}</p>
                    <Link to={`/profile/${product.sellerId}`} className="seller-profile-link" title="Ver perfil do vendedor">
                        <i className="fa fa-user" aria-hidden="true"></i> Ver perfil do vendedor
                    </Link>
                    {console.log('Seller ID:', product.sellerId)}
    
                    <section className="detalhes-form-buttons">
                        {/* Botão Comprar - só para não proprietários */}
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
    
                        {/* Botões Editar/Eliminar - para proprietário ou admin */}
                        {canEditOrDelete && (
                            <>
                                <button id="editar-produto" type="button" title="Editar Produto" onClick={() => setIsEditing(true)}>
                                    Editar <i className="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                                <button id="eliminar-produto" type="button" title="Eliminar Produto" onClick={handleDeleteProduct}>
                                    Eliminar <i className="fa fa-times" aria-hidden="true"></i>
                                </button>
                            </>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}    


function EditProductForm({ onSave, onCancel }) {
    const { product } = useProductStore(); // Use o produto do store Zustand
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
            alert('Estado do produto inválido!');
            return;
        }

        setEditedProduct(prev => ({
            ...prev,
            status: state.description, // Define a descrição
            estadoById: state.id // Define o ID
        }));
    };


    const handleSave = async () => {
        try {
            // Garante que o objeto `editedProduct` completo seja passado para `onSave`
            await onSave(editedProduct);
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
                />
            </h2>
            <p>
                <strong>Localização:</strong>
                <input
                    type="text"
                    name="location"
                    value={editedProduct.location}
                    onChange={handleInputChange}
                />
            </p>
            <p>
                <strong>Categoria:</strong>
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
                <strong>Preço:</strong>
                <input
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleInputChange}
                />
            </p>
            <p><strong>Publicado por:</strong> {editedProduct.sellerUsername}</p>
            <p>
                <strong>Descrição:</strong>
                <textarea
                    name="description"
                    value={editedProduct.description}
                    onChange={handleInputChange}
                />
            </p>
            <p>
                <strong>Estado:</strong>
                <select
                    name="status"
                    value={editedProduct.status}
                    onChange={handleStateChange}
                >
                    {Object.values(PRODUCT_STATES)
                        .filter(state => state.id !== PRODUCT_STATES.INATIVO.id)
                        .map(state => (
                            <option key={state.id} value={state.description}>
                                {state.description}
                            </option>
                        ))}
                </select>
            </p>
            <section className="detalhes-form-buttons">
                <button type="button" onClick={handleSave}>
                    Salvar <i className="fa fa-save" aria-hidden="true"></i>
                </button>
                <button type="button" onClick={onCancel}>
                    Cancelar <i className="fa fa-times" aria-hidden="true"></i>
                </button>
            </section>
        </div>
    );
}


function DeleteProductButton({ productId }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            'Tem certeza que deseja desativar este produto? Esta ação pode ser revertida na área administrativa.'
        );

        if (confirmDelete) {
            try {
                setIsDeleting(true);
                await productAPI.softDeleteProduct(productId);
                alert('Produto desativado com sucesso.');
                navigate('/');
            } catch (error) {
                console.error('Error deactivating product:', error);
                alert('Ocorreu um erro ao desativar o produto. Por favor, tente novamente.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            id="eliminar-produto"
            type="button"
            title="Eliminar Produto"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? (
                <>A processar... <i className="fa fa-spinner fa-spin" /></>
            ) : (
                <>Eliminar <i className="fa fa-times" /></>
            )}
        </button>
    );
}

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
    const navigate = useNavigate();

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
                placeholder="Title"
                required
            />
            <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
            />
            <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleInputChange}
                required
            >
                <option value="">Select a category</option>
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
                placeholder="Price"
                min="0"
                step="0.01"
                required
            />
            <input
                type="text"
                name="imageUrl"
                value={product.imageUrl}
                onChange={handleInputChange}
                placeholder="Image URL"
            />
            <input
                type="text"
                name="location"
                value={product.location}
                onChange={handleInputChange}
                placeholder="Location"
                required
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Submit'}
            </button>
            {onCancel && (
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
}

export const productComponents = {
    ProductCard,
    ProductList,
    RecentProducts,
    ProductDetails,
    DeleteProductButton,
    EditProductForm,
    ProductForm,
};



