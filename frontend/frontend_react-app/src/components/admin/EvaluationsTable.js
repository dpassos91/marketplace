import React, { useEffect, useState } from 'react';
import { evaluationAPI } from '../../api/evaluationAPI';
import Modal from '../commons/Modal';

const { getAllEvaluations, deleteEvaluation, getEvaluationById, updateEvaluation } = evaluationAPI;

const EvaluationRow = React.memo(({ evaluation, onEdit, onDelete }) => {
  return (
    <tr>
      <td style={{ textAlign: 'center' }}>{evaluation.evaluatorUsername}</td>
      <td style={{ textAlign: 'center' }}>{evaluation.evaluatedUsername}</td>
      <td style={{ textAlign: 'center' }}>{evaluation.comment}</td>
      <td style={{ textAlign: 'center' }}>{evaluation.rating}</td>
      <td style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button
            className="btn-card tabela-btn btn-info"
            onClick={() => onEdit(evaluation.id)}
          >
            Editar
          </button>
          <button
            className="btn-card tabela-btn btn-danger"
            onClick={() => onDelete(evaluation.id)}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
});

const EvaluationsTable = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evaluationToEdit, setEvaluationToEdit] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedComment, setEditedComment] = useState('');
  const [editedRating, setEditedRating] = useState('');

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await getAllEvaluations();
        setEvaluations(response);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar as avaliações');
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza de que deseja eliminar esta avaliação?')) {
      try {
        await deleteEvaluation(id);
        setEvaluations((prevEvaluations) =>
          prevEvaluations.filter((evaluation) => evaluation.id !== id)
        );
        alert('Avaliação eliminada com sucesso!');
      } catch (err) {
        setError('Erro ao excluir a avaliação');
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const evaluation = await getEvaluationById(id);
      setEvaluationToEdit(evaluation);
      setEditedTitle(evaluation.title); // Preenche o título para edição
      setEditedComment(evaluation.comment); // Preenche o comentário para edição
      setEditedRating(evaluation.rating); // Preenche a nota para edição
      setIsModalOpen(true);
    } catch (err) {
      setError('Erro ao buscar avaliação para editar');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEvaluationToEdit(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const updatedEvaluation = {
        ...evaluationToEdit,
        title: editedTitle,
        comment: editedComment,
        rating: editedRating,
      };

      await updateEvaluation(updatedEvaluation.id, updatedEvaluation);

      setEvaluations((prevEvaluations) =>
        prevEvaluations.map((evaluation) =>
          evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
        )
      );

      handleCloseModal();
      alert('Avaliação atualizada com sucesso!');
    } catch (err) {
      setError('Erro ao salvar a avaliação');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Avaliador</th>
            <th style={{ textAlign: 'center' }}>Avaliado</th>
            <th style={{ textAlign: 'center' }}>Comentário</th>
            <th style={{ textAlign: 'center' }}>Nota</th>
            <th style={{ textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <EvaluationRow
              key={evaluation.id}
              evaluation={evaluation}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      {/* Modal de Edição */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Avaliação">
        {evaluationToEdit && (
          <>
            {/* Informações fixas */}
            <div style={{ marginBottom: '10px' }}>
              <p><strong>Avaliador:</strong> {evaluationToEdit.evaluatorUsername}</p>
              <p><strong>Avaliado:</strong> {evaluationToEdit.evaluatedUsername}</p>
              <p><strong>Data:</strong> {new Date(evaluationToEdit.date).toLocaleDateString()}</p>
            </div>

            {/* Campos editáveis */}
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '10px' }}>
                <label>Título:</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Comentário:</label>
                <textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label>Nota:</label>
                <input
                  type="number"
                  value={editedRating}
                  onChange={(e) => setEditedRating(e.target.value)}
                  min="1"
                  max="5"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Botões de ação */}
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button className="btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button className="btn-primary" type="submit">
                  Salvar
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default EvaluationsTable;


