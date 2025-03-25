import React, { useState, useEffect } from 'react';
import { evaluationAPI } from '../api/evaluationAPI.js';
import { formatDate } from '../utils/dateUtils.js';

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
      {evaluation.canEdit && (
        <div className="evaluation-actions">
          <button className="btn-primary edit-evaluation-btn">Editar</button>
          <button className="btn-danger delete-evaluation-btn">Apagar</button>
        </div>
      )}
    </div>
  );
}

function SellerEvaluations({ sellerId, evaluations, currentUser, onAddEvaluation, canEvaluate }) {
  return (
    <div>
      <h2>Avaliações do Vendedor</h2>
      {evaluations.map((evaluation) => (
        <div key={evaluation.id}>
          <p>
            <strong>{evaluation.author}:</strong> {evaluation.comment} (Rating: {evaluation.rating})
          </p>
        </div>
      ))}
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

function AddEvaluationModal({ sellerId, onClose, onSubmit }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    async function fetchEligibleProducts() {
      try {
        const fetchedProducts = await evaluationAPI.getEligibleProductsForEvaluation();
        const sellerProducts = fetchedProducts.filter(product => product.sellerId == sellerId);
        setProducts(sellerProducts);
      } catch (error) {
        console.error('Error fetching eligible products:', error);
      }
    }

    fetchEligibleProducts();
  }, [sellerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || rating === 0) {
      alert('Por favor, selecione um produto e forneça uma avaliação.');
      return;
    }

    try {
      const evaluationData = {
        evaluatedId: sellerId,
        productId: selectedProduct.id,
        rating,
        comment,
      };

      await evaluationAPI.addEvaluation(evaluationData);
      onSubmit();
    } catch (error) {
      console.error('Error adding evaluation:', error);
      alert('Erro ao adicionar avaliação. Por favor, tente novamente.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Avaliar Vendedor</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={selectedProduct?.id || ''}
            onChange={(e) => {
              const selectedProductId = e.target.value;
              const product = products.find((p) => p.id == selectedProductId);
              setSelectedProduct(product);
            }}
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Avaliação (1-5)"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentário (opcional)"
          />
          <button type="submit">Enviar Avaliação</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

function EditEvaluationModal({ evaluation, sellerId, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    id: evaluation.id,
    title: evaluation.title,
    rating: evaluation.rating,
    comment: evaluation.comment,
    evaluatorId: evaluation.evaluatorId
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      await evaluationAPI.updateEvaluation(formData);
      alert('Avaliação atualizada com sucesso!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro a atualizar a avaliação:', error);
      alert('Falha a atualizar a avaliação.');
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h3>Editar Review</h3>
          <button type="button" className="close-modal" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form id="editEvaluationForm" onSubmit={handleSubmit}>
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
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" form="editEvaluationForm">Atualizar</button>
        </div>
      </div>
    </div>
  );
}

// Função para calcular a média das avaliações
function calculateAverageRating(evaluations) {
  const totalRating = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.rating,
    0
  );
  const averageRating = totalRating / evaluations.length;
  const averageRatingStars =
    '★'.repeat(Math.round(averageRating)) +
    '☆'.repeat(5 - Math.round(averageRating));

  return { averageRating, averageRatingStars };
}

export const evaluationComponents = {
  EvaluationCard,
  SellerEvaluations,
  AddEvaluationButton,
  EvaluationActions,
  AddEvaluationModal,
  EditEvaluationModal,
  calculateAverageRating
};
