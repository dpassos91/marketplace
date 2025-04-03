import React from 'react';

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

export default AddEvaluationButton;
