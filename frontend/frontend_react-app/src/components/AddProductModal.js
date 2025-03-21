import React, { useState, useEffect } from 'react';
import { productAPI } from '../api/productAPI'; // Ajuste o caminho conforme necessário
import { categoryAPI } from '../api/categoryAPI'
import useAuthStore from '../stores/authStore';
import { PRODUCT_STATES } from '../api/productStates' // Ajuste o caminho conforme necessário

function AddProductModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    imageUrl: '',
    location: '',
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryAPI.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      alert('You must be logged in to add a product');
      return;
    }

    // Validate inputs
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      isNaN(parseInt(formData.categoryId)) ||
      parseInt(formData.categoryId) <= 0 ||
      !formData.price ||
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    setIsSubmitting(true);

    const newProduct = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      price: parseFloat(formData.price),
      sellerId: user.id,
      estadoById: PRODUCT_STATES.DISPONIVEL.id,
    };

    try {
      await productAPI.createProduct(newProduct);
      alert('Product created successfully!');
      onClose();
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        price: '',
        imageUrl: '',
        location: '',
      });
      // Você pode adicionar aqui uma função para atualizar a lista de produtos, se necessário
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Product</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select className="form-control" id="category" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
              </div>
              <div className="form-group">
                <label htmlFor="imageURL">Image URL</label>
                <input type="url" className="form-control" id="imageURL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" className="form-control" id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;
