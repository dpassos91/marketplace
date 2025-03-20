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

function SellerEvaluations({ sellerId, evaluations, currentUser, onAddEvaluation }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allEvaluations, setAllEvaluations] = useState(evaluations || []);

  useEffect(() => {
    async function loadEvaluations() {
      try {
        setLoading(true);
        const fetchedEvaluations = await evaluationAPI.getEvaluationsForSeller(sellerId);

        if (!fetchedEvaluations || fetchedEvaluations.length === 0) {
          setAllEvaluations([]);
          return;
        }

        const preparedEvaluations = fetchedEvaluations.map(evaluation => ({
          ...evaluation,
          canEdit: currentUser && (
            String(evaluation.evaluatorId) === String(currentUser.id) || currentUser.admin
          )
        }));

        setAllEvaluations(preparedEvaluations);
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
        setError('Falha ao carregar avaliações. Por favor volte a tentar mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    loadEvaluations();
  }, [sellerId, currentUser]);

  const handleEditEvaluation = (evaluation, sellerId) => {
    // Lógica para exibir o modal de edição da avaliação
    console.log('Editar avaliação:', evaluation, 'para o vendedor:', sellerId);
  };

  const handleDeleteEvaluation = async (evaluationId, sellerId) => {
    if (window.confirm('Tem a certeza que pretende eliminar esta review?')) {
      try {
        // Chamar a API para deletar a avaliação
        await evaluationAPI.deleteEvaluation(evaluationId);

        // Atualizar a lista de avaliações após a exclusão
        setAllEvaluations(prevEvaluations => prevEvaluations.filter(evaluation => evaluation.id !== evaluationId));
        alert('Review eliminada com sucesso!');
      } catch (error) {
        console.error('Erro ao eliminar a avaliação:', error);
        alert('Falha ao apagar a avaliação.');
      }
    }
  };

  function calculateAverageRating(evaluations) {
    const totalRating = evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0);
    const averageRating = totalRating / evaluations.length;
    const averageRatingStars = '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating));
    return { averageRating, averageRatingStars };
  }

  if (loading) return <div className="loading-spinner">A carregar avaliações...</div>;
  if (error) return <p className="text-danger">{error}</p>;
  if (allEvaluations.length === 0) return <p>Este vendedor ainda não foi avaliado.</p>;

  const { averageRating, averageRatingStars } = calculateAverageRating(allEvaluations);

  return (
    <div>
      <AddEvaluationButton
        currentUser={currentUser}
        sellerId={sellerId}
        onAddEvaluation={onAddEvaluation}
      />
      <div className="average-rating">
        <h3>Rating médio: {averageRatingStars} ({averageRating.toFixed(1)})</h3>
        <p>{allEvaluations.length} {allEvaluations.length !== 1 ? 'evaluations' : 'evaluation'}</p>
      </div>
      <div className="evaluations-list">
        {allEvaluations.map(evaluation => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
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
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    title: '',
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    const fetchEligibleProducts = async () => {
      try {
        const currentUser = JSON.parse(sessionStorage.getItem('user'));
        if (!currentUser || !currentUser.id) {
          alert('Precisa de estar autenticado para submeter uma avaliação.');
          onClose();
          return;
        }

        const products = await evaluationAPI.getEligibleProductsForEvaluation(currentUser.id);
        const sellerProducts = products.filter(product => product.sellerId == sellerId);

        if (sellerProducts.length === 0) {
          alert('Não existem produtos elegíveis para avaliar este vendedor.');
          onClose();
          return;
        }

        setEligibleProducts(sellerProducts);
      } catch (error) {
        console.error('Error fetching eligible products:', error);
        alert('Não foi possível carregar os produtos para avaliação. Tente novamente mais tarde.');
        onClose();
      }
    };

    fetchEligibleProducts();
  }, [sellerId, onClose]);

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
      alert('Por favor selecione um produto para avaliar.');
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

    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const evaluationData = {
      ...formData,
      evaluatedId: sellerId,
      evaluatorId: currentUser.id,
      productId: parseInt(formData.productId)
    };

    try {
      const response = await evaluationAPI.addEvaluation(evaluationData);
      if (response.error) {
        throw new Error(response.error);
      }
      alert('Review submetida com sucesso!');
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Erro ao submeter a avaliação:', error);
      alert(`Falha na submissão da avaliação: ${error.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="modal-header">
          <h3>Adicionar Review</h3>
          <button type="button" className="close-modal" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form id="evaluationForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productId">Escolha o produto comprado:</label>
              <select id="productId" value={formData.productId} onChange={handleInputChange} required>
                <option value="">Selecione um produto</option>
                {eligibleProducts.map(product => (
                  <option key={product.id} value={product.id}>{product.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input type="text" id="title" value={formData.title} onChange={handleInputChange} required maxLength="100" />
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
              <textarea id="comment" value={formData.comment} onChange={handleInputChange} rows="3" required maxLength="500" />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary" form="evaluationForm">Submit</button>
        </div>
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
