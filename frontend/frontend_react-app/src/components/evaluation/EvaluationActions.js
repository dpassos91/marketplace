import React from 'react';

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

export default EvaluationActions;
