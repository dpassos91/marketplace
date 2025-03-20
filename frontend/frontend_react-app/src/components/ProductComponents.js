import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { categoryAPI } from '../api/categoryAPI.js';
import { productAPI } from '../api/productAPI.js'; 
import { PRODUCT_STATES } from '../api/productStates.js';
import { categoryComponents } from './categoryComponents.js';

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
    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const productData = await productAPI.getProductById(id);
                if (!productData) {
                    alert('Produto não encontrado!');
                    return;
                }
                setProduct(productData);
            } catch (error) {
                console.error('Error loading product details:', error);
            }
        }
        fetchProductDetails();
    }, [id]);

    if (!product) {
        return <p>Carregando detalhes do produto...</p>;
    }

    return (
        <div className="detalhes-container">
            <div className="imagem">
                <img src={product.imageUrl} alt={product.title} />
            </div>
            <form id="detalhes-produto-form">
                <label htmlFor="nome-produto">Nome do Produto:</label>
                <input type="text" id="nome-produto" value={product.title} readOnly={!isEditing} />

                <label htmlFor="localizacao">Localização:</label>
                <input type="text" id="localizacao" value={product.location} readOnly={!isEditing} />

                <label htmlFor="categoria-readonly">Categoria:</label>
                <input type="text" id="categoria-readonly" value={product.categoryName} readOnly={!isEditing} />

                {isEditing && (
                    <>
                        <label htmlFor="categoria">Categoria:</label>
                        <select id="categoria" title="Categoria do Produto">
                            <option value="">Selecione uma categoria</option>
                            {/* Populate categories here */}
                        </select>
                    </>
                )}

                <label htmlFor="preco">Preço:</label>
                <input type="text" id="preco" value={`${parseFloat(product.price).toFixed(2)}€`} readOnly={!isEditing} />

                <label htmlFor="publicado-por">Publicado por:</label>
                <div className="seller-info">
                    <input type="text" id="publicado-por" value={product.sellerUsername} readOnly />
                    <Link to={`/perfil-utilizador/${product.sellerId}`} className="seller-profile-link" title="Ver perfil do vendedor">
                        <i className="fa fa-user" aria-hidden="true"></i> Ver perfil
                    </Link>
                </div>
                <label htmlFor="descricao">Descrição:</label>
                <textarea id="descricao" readOnly={!isEditing} value={product.description} />

                <label htmlFor="estado-produto-readonly">Estado:</label>
                <input type="text" id="estado-produto-readonly" value={product.status} readOnly={!isEditing} />

                {isEditing && (
                    <>
                        <label htmlFor="estado-produto">Estado:</label>
                        <select name="estado-produto" id="estado-produto" title="Estado do Produto">
                            {/* Populate state options here */}
                        </select>
                    </>
                )}

                <section className="detalhes-form-buttons">
                    <button id="enviar-mensagem" type="button" title="Enviar Mensagem\nFuncionalidade não implementada">
                        Enviar Mensagem <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                    </button>

                    <button id="comprar-produto" type="button" title="Comprar" data-produto-id={product.id}>
                        Comprar <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                    </button>

                    {/* Add logic to show/hide these buttons based on user permissions */}
                    {/* <button id="editar-produto" type="button" title="Editar Produto" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Salvar' : 'Editar'} <i className="fa fa-pencil" aria-hidden="true"></i>
          </button> */}
                    {/*  <button id="eliminar-produto" type="button" title="Eliminar Produto">
            Eliminar <i className="fa fa-times" aria-hidden="true"></i>
          </button> */}
                </section>

                <input type="hidden" id="categoria-id" value={product.categoryId} />
            </form>
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

function EditProductForm({ product, onSave }) {
    const [categories, setCategories] = useState([]);
    const [editedProduct, setEditedProduct] = useState({ ...product });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryAPI.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedProduct(prev => ({
            ...prev,
            [id]: id === 'price' ? parseFloat(value) : value
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find(cat => cat.id === e.target.value);
        setEditedProduct(prev => ({
            ...prev,
            categoryId: e.target.value,
            categoryName: selectedCategory?.name || ''
        }));
    };

    const handleStateChange = (e) => {
        setEditedProduct(prev => ({
            ...prev,
            status: e.target.value
        }));
    };
    const handleSave = async () => {
        try {
            await onSave(editedProduct);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <>
            <label htmlFor="preco">Preço:</label>
            <input
                type="number"
                id="price"
                value={isEditing ? editedProduct.price : parseFloat(editedProduct.price).toFixed(2)}
                onChange={handleInputChange}
                readOnly={!isEditing}
            />

            {isEditing && (
                <>
                    <label htmlFor="categoria">Categoria:</label>
                    <select
                        id="categoria"
                        value={editedProduct.categoryId}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="estado-produto">Estado:</label>
                    <select
                        id="estado-produto"
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
                </>
            )}

            <button
                id="editar-produto"
                type="button"
                title="Editar Produto"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
                {isEditing ? 'Salvar' : 'Editar'}
                <i className={`fa fa-${isEditing ? 'save' : 'pencil'}`} aria-hidden="true" />
            </button>
        </>
    );
}

// Uso no componente ProductDetails
function ProductDetails2() {
    // ... (código anterior)
    const [product, setProduct] = useState(null);

    const handleSaveProduct = async (updatedProduct) => {
        try {
            const savedProduct = await productAPI.updateProduct(updatedProduct);
            setProduct(savedProduct);
            alert('Produto atualizado com sucesso!');
        } catch (error) {
            alert('Erro ao atualizar o produto');
            throw error;
        }
    };

    return (
        <div className="detalhes-container">
            {/* ... outros elementos */}
            <EditProductForm product={product} onSave={handleSaveProduct} />
            <DeleteProductButton productId={product?.id} />
        </div>
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
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error('You must be logged in to add a product');
            }

            const productToSave = {
                ...product,
                price: parseFloat(product.price),
                categoryId: parseInt(product.categoryId),
                sellerId: user.id,
                estadoById: PRODUCT_STATES.DISPONIVEL.id,
            };

            await onSave(productToSave);
            alert('Product saved successfully!');
            navigate('/'); // or wherever you want to redirect after saving
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

function AddProductModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = async (newProduct) => {
        try {
            await productAPI.createProduct(newProduct);
            setIsModalOpen(false);
            // You might want to refresh the product list or navigate somewhere here
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>Add New Product</button>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Product</h2>
                        <ProductForm
                            onSave={handleSave}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
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
    AddProductModal
};



