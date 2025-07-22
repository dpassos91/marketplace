import React, { useState, useEffect } from 'react';
import { evaluationAPI } from '../../api/evaluationAPI';

function EvaluationModal({ sellerId, onClose, onSubmit, currentUser, initialData = null, eligibleProducts = [] }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialData || {
    title: '',
    rating: 0,
    comment: '',
    productId: ''
  });

  const isEditMode = !!initialData;

  useEffect(() => {
    if (eligibleProducts.length > 0) {
      setProducts(eligibleProducts);
    } else {
      async function fetchEligibleProducts() {
        try {
          if (currentUser && currentUser.id) {
            const fetchedProducts = await evaluationAPI.checkEligibility(currentUser.id);
            const sellerProducts = fetchedProducts.filter(product => product.sellerId == sellerId);
            setProducts(sellerProducts);
          } else {
            console.warn("currentUser ou currentUser.id não estão definidos!");
          }
        } catch (error) {
          console.error('Erro ao buscar produtos elegíveis:', error);
        }
      }
      fetchEligibleProducts();
    }
  }, [sellerId, currentUser, eligibleProducts]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
  
    if (!formData.productId && !isEditMode) {
      alert('Por favor, selecione um produto.');
      return;
    }
  
    if (!formData.title.trim()) {
      alert('Por favor preencha o título.');
      return;
    }
  
    if (formData.rating === 0) {
      alert('Por favor selecione um valor para esta avaliação.');
      return;
    }
  
    if (!formData.comment.trim()) {
      alert('Por favor preencha o comentário.');
      return;
    }
  
    try {
      const evaluationData = {
        evaluator: currentUser.id,  // Alterado
        evaluated: sellerId,        // Alterado
        product: formData.productId,  // Alterado
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment
      };
      
  
      console.log('A enviar avaliação:', evaluationData); // 👈 Debug importante
  
      let result;
      if (isEditMode) {
        result = await evaluationAPI.updateEvaluation(formData.id, evaluationData);
      } else {
        result = await evaluationAPI.addEvaluation(evaluationData);
      }
  
      alert(isEditMode ? 'Avaliação atualizada com sucesso!' : 'Avaliação adicionada com sucesso!');
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Erro completo ao ' + (isEditMode ? 'atualizar' : 'adicionar') + ' avaliação:', error);
      if (error.body) {
        alert('Erro: ' + error.body);
      } else {
        alert('Falha ao ' + (isEditMode ? 'atualizar' : 'adicionar') + ' avaliação.');
      }
    }
  };
  
  

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h3>{isEditMode ? 'Editar' : 'Adicionar'} Avaliação</h3>
          <button type="button" className="close-modal" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form id="evaluationForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productId">Produto</label>
              <select
                id="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required={!isEditMode}
                disabled={isEditMode}
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
              {isEditMode ? 'Atualizar' : 'Adicionar'} Avaliação
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EvaluationModal;


