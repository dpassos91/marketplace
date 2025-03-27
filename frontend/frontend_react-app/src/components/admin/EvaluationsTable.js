import React, { useEffect, useState } from 'react';
import { evaluationAPI } from '../../api/evaluationAPI';

const { getAllEvaluations } = evaluationAPI;

const EvaluationsTable = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        // Chama a função da API para obter todas as avaliações
        const response = await getAllEvaluations();
        setEvaluations(response); // A resposta pode já ser um objeto com as avaliações
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar as avaliações');
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []); // A dependência vazia garante que isso seja executado apenas uma vez

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Comentário</th>
          <th>Nota</th>
        </tr>
      </thead>
      <tbody>
        {evaluations.map((evaluation) => (
          <tr key={evaluation.id}>
            <td>{evaluation.id}</td>
            <td>{evaluation.comment}</td>
            <td>{evaluation.rating}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EvaluationsTable;


