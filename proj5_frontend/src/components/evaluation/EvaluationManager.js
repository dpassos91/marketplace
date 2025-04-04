import React, { useState, useEffect } from 'react';
import EvaluationModal from './EvaluationModal';
import { evaluationAPI } from '../../api/evaluationAPI';

function EvaluationManager({ sellerId, currentUser }) {
  const [evaluations, setEvaluations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  useEffect(() => {
    fetchEvaluations();
  }, [sellerId]);

  const fetchEvaluations = async () => {
    try {
      const fetchedEvaluations = await evaluationAPI.getEvaluationsForSeller(sellerId);
      setEvaluations(fetchedEvaluations);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const handleAddEvaluation = () => {
    setCurrentEvaluation(null);
    setIsModalOpen(true);
  };

  const handleEditEvaluation = (evaluation) => {
    setCurrentEvaluation(evaluation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvaluation(null);
  };

  const handleSubmitEvaluation = () => {
    fetchEvaluations();
  };

  return (
    <div>
      <h2>Avaliações</h2>
      {/* Só o admin pode adicionar novas avaliações */}
      {currentUser && currentUser.isAdmin && (
        <button onClick={handleAddEvaluation}>Adicionar Avaliação</button>
      )}
      
      {evaluations.map(evaluation => (
        <div key={evaluation.id}>
          <h3>{evaluation.title}</h3>
          <p>Rating: {evaluation.rating}</p>
          <p>{evaluation.comment}</p>
          {/* Admin e o avaliador podem editar */}
          {(currentUser.isAdmin || currentUser.id === evaluation.evaluatorId) && (
            <button onClick={() => handleEditEvaluation(evaluation)}>Editar</button>
          )}
        </div>
      ))}

      {isModalOpen && (
        <EvaluationModal
          sellerId={sellerId}
          onClose={handleCloseModal}
          onSubmit={handleSubmitEvaluation}
          currentUser={currentUser}
          initialData={currentEvaluation}
        />
      )}
    </div>
  );
}

export default EvaluationManager;
