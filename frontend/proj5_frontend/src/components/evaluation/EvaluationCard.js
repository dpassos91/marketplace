import React from 'react';
import { formatDate } from '../../utils/dateUtils';
import '../../css/EvaluationStyles.css';

function EvaluationCard({ evaluation, currentUser, onEditEvaluation }) {
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
      {currentUser && currentUser.id === evaluation.evaluatorId && (
        <div className="evaluation-edit">
          <button onClick={() => onEditEvaluation(evaluation)}>Editar</button>
        </div>
      )}
    </div>
  );
}

export default EvaluationCard;

