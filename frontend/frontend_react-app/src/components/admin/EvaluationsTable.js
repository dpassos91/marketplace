import React, { useEffect, useState } from 'react';
import { evaluationAPI } from '../../api/evaluationAPI';
import Modal from '../commons/Modal'; // Importe o componente Modal

const { getAllEvaluations, deleteEvaluation, getEvaluationById, updateEvaluation } = evaluationAPI;

const EvaluationsTable = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
  const [evaluationToEdit, setEvaluationToEdit] = useState(null); // Avaliação para editar

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

  // Função para excluir a avaliação
  const handleDelete = async (id) => {
    try {
      await deleteEvaluation(id);
      setEvaluations((prevEvaluations) =>
        prevEvaluations.filter((evaluation) => evaluation.id !== id)
      );
    } catch (err) {
      setError('Erro ao excluir a avaliação');
    }
  };

  // Função para abrir o modal de edição
  const handleEdit = async (id) => {
    try {
      const evaluation = await getEvaluationById(id);
      setEvaluationToEdit(evaluation); // Defina a avaliação para editar
      setIsModalOpen(true); // Abra o modal
    } catch (err) {
      setError('Erro ao buscar avaliação para editar');
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Fechar o modal
    setEvaluationToEdit(null); // Limpar a avaliação selecionada
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Avaliador</th>
            <th>Avaliado</th>
            <th>Comentário</th>
            <th>Nota</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <tr key={evaluation.id}>
              <td>{evaluation.evaluatorUsername}</td>
              <td>{evaluation.evaluatedUsername}</td>
              <td>{evaluation.comment}</td>
              <td>{evaluation.rating}</td>
              <td>
                <button onClick={() => handleEdit(evaluation.id)}>Editar</button>
                <button onClick={() => handleDelete(evaluation.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Edição */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Avaliação">
        {evaluationToEdit && (
          <div>
            <p><strong>Avaliador:</strong> {evaluationToEdit.evaluatorUsername}</p>
            <p><strong>Avaliado:</strong> {evaluationToEdit.evaluatedUsername}</p>
            <p><strong>Comentário:</strong> {evaluationToEdit.comment}</p>
            <p><strong>Nota:</strong> {evaluationToEdit.rating}</p>
            {/* Aqui, você pode adicionar campos para editar a avaliação */}
            {/* Exemplo: */}
            <form>
              <div>
                <label>Comentário:</label>
                <textarea defaultValue={evaluationToEdit.comment} />
              </div>
              <div>
                <label>Nota:</label>
                <input type="number" defaultValue={evaluationToEdit.rating} />
              </div>
              <button type="submit">Salvar</button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EvaluationsTable;

