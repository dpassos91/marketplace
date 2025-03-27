import React, { useState, useCallback, useMemo } from 'react';
import useFetchUsers from '../../hooks/useFetchUsers';
import { userAPI } from '../../api/userAPI';
import Modal from '../commons/Modal';

const USERS_PER_PAGE = 10;

const UserRow = React.memo(({ user, onRedirect, onOpenModal }) => {
  const active = Boolean(user.active);

  return (
    <tr className={active ? '' : 'suspended-user'}>
      <td style={{ textAlign: 'center' }}>{user.username}</td>
      <td style={{ textAlign: 'center' }}>{user.email}</td>
      <td style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button
            className="btn-card tabela-btn btn-danger"
            onClick={() => onRedirect(user.id)}
          >
            Consultar perfil
          </button>
          {active ? (
            <button
              className="btn-card tabela-btn btn-info"
              onClick={() => onOpenModal(user.id, 'suspend')}
            >
              Suspender
            </button>
          ) : (
            <button
              className="btn-card tabela-btn btn-success"
              onClick={() => onOpenModal(user.id, 'reactivate')}
            >
              Reativar
            </button>
          )}
          <button
            className="btn-card tabela-btn btn-edit"
            onClick={() => onOpenModal(user.id, 'delete')}
          >
            Excluir
          </button>
        </div>
      </td>
    </tr>
  );
});

const UserTable = () => {
  const { users, loading, error, refetch } = useFetchUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ userId: null, action: '', message: '' });

  const totalPages = useMemo(() => Math.ceil((users?.length || 0) / USERS_PER_PAGE), [users]);

  const getUsersForPage = useCallback((page) => {
    if (!users) return [];
    const start = (page - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    return users.slice(start, end);
  }, [users]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleRedirectToProfile = useCallback((userId) => {
    window.location.href = `http://localhost:3000/profile/${userId}`;
  }, []);

  const handleActionConfirm = useCallback(async () => {
    const { userId, action } = modalData;
  
    try {
      let apiResponse = null;
      if (action === 'suspend') {
        apiResponse = await userAPI.suspendUser(userId);
      } else if (action === 'reactivate') {
        apiResponse = await userAPI.reactivateUser(userId);
      } else if (action === 'delete') {
        apiResponse = await userAPI.deleteUser(userId);
      }
  
      // Se a resposta da API não for nula, exiba a mensagem
      if (apiResponse) {
        let message = `Ação ${action} realizada com sucesso para o utilizador ${userId}!`;
  
        if (typeof apiResponse === 'string') {
          message = apiResponse;
        } else if (apiResponse.message) {
          message = apiResponse.message;
        }
  
        alert(message);
      }
  
      refetch(); // Atualiza a lista de usuários
    } catch (err) {
      console.error(err);
      alert(`Erro ao realizar ação: ${action}`);
    } finally {
      setIsModalOpen(false);
    }
  }, [modalData, refetch]);
  

  const handleOpenModal = useCallback((userId, action) => {
    const messages = {
      suspend: `Tem certeza de que deseja suspender o utilizador com ID ${userId}?`,
      reactivate: `Tem certeza de que deseja reativar o utilizador com ID ${userId}?`,
      delete: `Tem certeza de que deseja excluir o utilizador com ID ${userId}?`
    };

    setModalData({ userId, action, message: messages[action] });
    setIsModalOpen(true);
  }, []);

  if (loading) {
    return <div>A carregar utilizadores...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!users || users.length === 0) {
    return <div>Nenhum usuário encontrado.</div>;
  }

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirmação de Ação"
      >
        <p>{modalData.message}</p>
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleActionConfirm}>
            Confirmar
          </button>
        </div>
      </Modal>

      <table>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>Username</th>
            <th style={{ textAlign: 'center' }}>Email</th>
            <th style={{ textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {getUsersForPage(currentPage).map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onRedirect={handleRedirectToProfile}
              onOpenModal={handleOpenModal}
            />
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: page === currentPage ? '#007bff' : '#f0f0f0',
              color: page === currentPage ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTable;



