import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils.js';
import { evaluationAPI } from '../api/evaluationAPI.js';
import '../css/EvaluationStyles.css'; // Certifique-se de criar este arquivo CSS

function EvaluationCard({ evaluation }) {
  const ratingStars = '★'.repeat(evaluation.rating) + '☆'.repeat(5 - evaluation.rating);

  return (
    <div className="evaluation-card" data-evaluation-id={evaluation.id}>
      <div className="evaluation-header">
        <h4>{evaluation.title}</h4>
        <div className="evaluation-rating">{ratingStars}</div>
        <div className="evaluation-date">{formatDate(evaluation.evaluationDate)}</div>
      </div>
      <div className="evaluation-body">
        <p>{evaluation.comment}</p>
      </div>
    </div>
  );
}

function AverageRating({ averageRating, averageRatingStars, numberOfEvaluations }) {
  return (
    <div className="average-rating">
      Média: {averageRatingStars} ({averageRating.toFixed(1)} de 5) - {numberOfEvaluations} avaliações
    </div>
  );
}

function SellerEvaluations({ sellerId, evaluations, currentUser, onAddEvaluation, canEvaluate }) {
  const { calculateAverageRating } = evaluationComponents;
  const { averageRating, averageRatingStars } = calculateAverageRating(evaluations);

  return (
    <div className="seller-evaluations">
      <h2>Avaliações do Vendedor</h2>

      <AverageRating
        averageRating={averageRating}
        averageRatingStars={averageRatingStars}
        numberOfEvaluations={evaluations.length}
      />

      <div className="evaluations-list">
        {evaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>

      {currentUser && currentUser.id !== sellerId && canEvaluate && (
        <button
          className="btn-primary add-evaluation-btn"
          onClick={() => onAddEvaluation(sellerId)}
        >
          Avaliar Vendedor
        </button>
      )}
    </div>
  );
}

function AddEvaluationButton({ currentUser, sellerId, onAddEvaluation }) {
  if (!currentUser || currentUser.id === sellerId) return null;

  return (
    <button
      className="btn-primary add-evaluation-btn"
      onClick={() => onAddEvaluation(sellerId)}
    >
      Avaliar Vendedor
    </button>
  );
}

function EvaluationActions({ evaluation, sellerId, onEdit, onDelete }) {
  return (
    <div className="evaluation-actions">
      <button
        className="btn-primary edit-evaluation-btn"
        onClick={() => onEdit(evaluation, sellerId)}
      >
        Editar
      </button>
      <button
        className="btn-danger delete-evaluation-btn"
        onClick={() => onDelete(evaluation.id, sellerId)}
      >
        Apagar
      </button>
    </div>
  );
}

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

    if (formData.rating === 0) {
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

const calculateAverageRating = (evaluations) => {
  if (!evaluations || evaluations.length === 0) {
    return { averageRating: 0, averageRatingStars: 'N/A' };
  }

  const totalRating = evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0);
  const averageRating = totalRating / evaluations.length;
  const averageRatingStars = '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating));

  return { averageRating, averageRatingStars };
};

export const evaluationComponents = {
  EvaluationCard,
  AverageRating,
  SellerEvaluations,
  AddEvaluationButton,
  EvaluationActions,
  AddEvaluationModal,
  calculateAverageRating,
};

