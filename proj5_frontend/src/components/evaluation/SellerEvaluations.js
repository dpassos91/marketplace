import React from 'react';
import EvaluationCard from './EvaluationCard';
import AverageRating from './AverageRating';
import calculateAverageRating from '../../utils/calculateAverageRating';

function SellerEvaluations({ sellerId, evaluations, currentUser, onAddEvaluation, onEditEvaluation, canEvaluate }) {
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
          <EvaluationCard 
            key={evaluation.id} 
            evaluation={evaluation}
            currentUser={currentUser}
            onEditEvaluation={onEditEvaluation}
          />
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

export default SellerEvaluations;
