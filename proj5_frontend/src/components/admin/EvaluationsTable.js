import React, { useMemo, useState } from 'react';
import { evaluationAPI } from '../../api/evaluationAPI';
import Modal from '../commons/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import EvaluationForm from '../evaluation/EvaluationForm';
import TableDataState from './TableDataState';
import useTableData from '../../hooks/useTableData';
import Pagination from '../commons/Pagination';

const { deleteEvaluation, getEvaluationById, updateEvaluation, getAllEvaluations } = evaluationAPI;

const EvaluationRow = React.memo(({ evaluation, onEdit, onDelete }) => (
  <tr>
    <td>{evaluation.evaluatorUsername}</td>
    <td>{evaluation.evaluatedUsername}</td>
    <td>{evaluation.date}</td>
    <td>{evaluation.rating}</td>
    <td>
      <div className="table-actions">
        <button className="btn-card tabela-btn btn-info" onClick={() => onEdit(evaluation.id)}>
          <FormattedMessage id="admin.evaluationTable.edit" defaultMessage="Editar" />
        </button>
        <button className="btn-card tabela-btn btn-danger" onClick={() => onDelete(evaluation.id)}>
          <FormattedMessage id="admin.evaluationTable.delete" defaultMessage="Eliminar" />
        </button>
      </div>
    </td>
  </tr>
));

const EvaluationsTable = () => {
  const intl = useIntl();

  const {
    data: evaluations,
    loading,
    error,
    refetch,
    removeItem,
    setData: setEvaluations,
  } = useTableData(getAllEvaluations);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [evaluationToEdit, setEvaluationToEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const paginatedEvaluations = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return evaluations.slice(start, end);
  }, [evaluations, currentPage]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      intl.formatMessage({ id: 'admin.window.confirm.deleteEvaluation', defaultMessage: 'Tem certeza de que deseja eliminar esta avaliação?' })
    );

    if (confirmed) {
      try {
        await deleteEvaluation(id);
        removeItem(id);
        alert(intl.formatMessage({ id: 'admin.alert.success.deleteEvaluation', defaultMessage: 'Avaliação eliminada com sucesso!' }));
      } catch (err) {
        alert(intl.formatMessage({ id: 'admin.alert.error.deleteEvaluation', defaultMessage: 'Erro ao excluir a avaliação' }));
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const evaluation = await getEvaluationById(id);
      setEvaluationToEdit(evaluation);
      setIsModalOpen(true);
    } catch (err) {
      alert(intl.formatMessage({ id: 'admin.alert.error.getEvaluation', defaultMessage: 'Erro ao buscar avaliação para editar' }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEvaluationToEdit(null);
  };

  const handleSave = async (updatedEvaluationData) => {
    try {
      const updatedEvaluation = {
        ...evaluationToEdit,
        ...updatedEvaluationData,
      };

      await updateEvaluation(updatedEvaluation.id, updatedEvaluation);

      setEvaluations((prev) =>
        prev.map((evaluation) =>
          evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
        )
      );

      handleCloseModal();
      alert(
        intl.formatMessage({
          id: 'admin.alert.success.updateEvaluation',
          defaultMessage: 'Avaliação atualizada com sucesso!',
        })
      );
    } catch (err) {
      alert(
        intl.formatMessage({
          id: 'admin.alert.error.updateEvaluation',
          defaultMessage: 'Erro ao salvar a avaliação',
        })
      );
    }
  };

  const isEmpty = !evaluations || evaluations.length === 0;

  if (loading || error || isEmpty) {
    return (
      <TableDataState
        loading={loading}
        error={error}
        message={isEmpty ? 'empty' : null}
        messagePrefix="admin.evaluationTable"
        image="/img/sem-avaliacoes.png"
      />
    );
  }

  return (
    <div>
      <h2 className="admin-title">Gestão de Avaliações</h2>
      <table>
        <thead>
          <tr>
            <th><FormattedMessage id="admin.evaluationTable.evaluator" defaultMessage="Avaliador" /></th>
            <th><FormattedMessage id="admin.evaluationTable.evaluated" defaultMessage="Avaliado" /></th>
            <th><FormattedMessage id="admin.evaluationTable.date" defaultMessage="Data" /></th>
            <th><FormattedMessage id="admin.evaluationTable.rating" defaultMessage="Nota" /></th>
            <th><FormattedMessage id="admin.evaluationTable.actions" defaultMessage="Ações" /></th>
          </tr>
        </thead>
        <tbody>
          {paginatedEvaluations.map((evaluation) => (
            <EvaluationRow
              key={evaluation.id}
              evaluation={evaluation}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>

      <Pagination
        totalPages={Math.ceil(evaluations.length / rowsPerPage)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={intl.formatMessage({ id: 'admin.modal.editEvaluation', defaultMessage: 'Editar Avaliação' })}
      >
        {evaluationToEdit && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>
                  <FormattedMessage id="evaluationForm.label.evaluator" defaultMessage="Avaliador" />:
                </strong>{' '}
                {evaluationToEdit.evaluatorUsername}
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>
                  <FormattedMessage id="evaluationForm.label.evaluated" defaultMessage="Avaliado" />:
                </strong>{' '}
                {evaluationToEdit.evaluatedUsername}
              </p>
              <p>
                <strong>
                  <FormattedMessage id="evaluationForm.label.date" defaultMessage="Data" />:
                </strong>{' '}
                {new Date(evaluationToEdit.date).toLocaleDateString()}
              </p>
            </div>

            <EvaluationForm
              initialEvaluation={evaluationToEdit}
              onSave={handleSave}
              onCancel={handleCloseModal}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default EvaluationsTable;
