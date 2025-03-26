import React, { useState, useEffect } from 'react';
import { evaluationAPI } from '../api/evaluationAPI.js';

function AddEvaluationModal({ sellerId, onClose, onSubmit, currentUser }) {
  console.log("AddEvaluationModal renderizado!")
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    rating: 0,
    comment: '',
    productId: ''
  });

  useEffect(() => {
    async function fetchEligibleProducts() {
      try {
        if (currentUser && currentUser.id) {
          const fetchedProducts = await evaluationAPI.getEligibleProductsForEvaluation(currentUser.id);
          console.log("Produtos elegíveis recebidos:", fetchedProducts);
          const sellerProducts = fetchedProducts.filter(product => product.sellerId == sellerId);
          setProducts(sellerProducts);
        } else {
          console.warn("currentUser ou currentUser.id não estão definidos!");
        }
      } catch (error) {
        console.error('Error fetching eligible products:', error);
      }
    }

    fetchEligibleProducts();
  }, [sellerId, currentUser]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId) {
      alert('Por favor, selecione um produto.');
      return;
    }

    if (!formData.title.trim()) {
      alert('Por favor preencha o título.');
      return;
    }

    if (!formData.rating === 0) {
      alert('Por favor selecione um rating para esta review.');
      return;
    }

    if (!formData.comment.trim()) {
      alert('Por favor preencha o comentário.');
      return;
    }

    try {
      const evaluationData = {
        evaluatorId: currentUser.id,
        evaluatedId: sellerId,
        productId: formData.productId,
        rating: formData.rating,
        comment: formData.comment,
        title: formData.title
      };

      console.log('Dados a serem enviados:', evaluationData); // Para debug

      await evaluationAPI.addEvaluation(evaluationData);
      alert('Avaliação adicionada com sucesso!');
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      alert('Falha ao adicionar avaliação.');
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h3>Adicionar Avaliação</h3>
          <button type="button" className="close-modal" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form id="addEvaluationForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productId">Produto</label>
              <select
                id="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength="100"
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${formData.rating >= star ? 'filled' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    {formData.rating >= star ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comentário</label>
              <textarea
                id="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows="3"
                required
                maxLength="500"
              />
            </div>
            <button type="submit" className="btn-primary">
              Adicionar Avaliação
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEvaluationModal;
