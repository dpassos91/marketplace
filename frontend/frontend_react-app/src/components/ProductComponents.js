import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useFormInput } from '../hooks/UseFormInput.js';
import { categoryAPI } from '../api/categoryAPI.js';
import { productAPI } from '../api/productAPI.js'; 
import { PRODUCT_STATES } from '../api/productStates.js';
import { categoryComponents } from './categoryComponents.js';
import useAuthStore from '../stores/authStore.js'; // Ajusta o caminho conforme necessário


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
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);

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
    }, [id, navigate]);

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
                await productAPI.deleteProduct(product.id);
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

    if (!product) {
        return <p>Carregando detalhes do produto...</p>;
    }

    const canEditOrDelete = user && (user.id === product.sellerId || user.role === 'ADMIN');

    return (
        <div className="detalhes-container">
            <div className="imagem">
                <img src={product.imageUrl} alt={product.title} />
            </div>
            {isEditing ? (
                <EditProductForm
                    initialProduct={product}
                    onSave={handleSaveProduct}
                    onCancel={handleCancel} // Passa a função handleCancel como prop
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

                    <section className="detalhes-form-buttons">
                        <button id="comprar-produto" type="button" title="Comprar" data-produto-id={product.id}>
                            Comprar <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                        </button>

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


function EditProductForm({ initialProduct, onSave, onCancel }) { // Recebe a função onCancel como prop
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, handleInputChange, setEditedProduct] = useFormInput(initialProduct);

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

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
        setEditedProduct(prev => ({
            ...prev,
            categoryId: parseInt(e.target.value),
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
                <button type="button" onClick={() => onSave(editedProduct)}>
                    Salvar <i className="fa fa-save" aria-hidden="true"></i>
                </button>
                <button type="button" onClick={onCancel}> {/* Usa a função onCancel passada como prop */}
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



