import React, { useState, useEffect } from 'react';
import useFetchUsers from '../../hooks/useFetchUsers';
import { userAPI } from '../../api/userAPI';
import Modal from '../commons/Modal';

const USERS_PER_PAGE = 10;

const UserTable = () => {
  const { users, loading, error } = useFetchUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users?.length / USERS_PER_PAGE);

  // Estado para controle do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ userId: null, action: '', message: '' });

  const getUsersForPage = (page) => {
    if (!users) return [];
    const start = (page - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    return users.slice(start, end);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRedirectToProfile = (userId) => {
    window.location.href = `http://localhost:3000/profile/${userId}`;
  };

  const handleActionConfirm = async () => {
    const { userId, action } = modalData;

    try {
      if (action === 'suspend') {
        await userAPI.suspendUser(userId);
        alert(`Utilizador ${userId} suspenso com sucesso!`);
      } else if (action === 'reactivate') {
        await userAPI.reactivateUser(userId);
        alert(`Utilizador ${userId} reativado com sucesso!`);
      } else if (action === 'delete') {
        await userAPI.deleteUser(userId);
        alert(`Utilizador ${userId} excluído com sucesso!`);
      }
      // Atualizar lista de utilizadores
      window.location.reload(); // Pode substituir por lógica de atualização mais eficiente
    } catch (err) {
      console.error(err);
      alert(`Erro ao realizar ação: ${action}`);
    } finally {
      setIsModalOpen(false); // Fechar o modal após a ação
    }
  };

  const handleOpenModal = (userId, action) => {
    let message = '';
    if (action === 'suspend') {
      message = `Tem certeza de que deseja suspender o utilizador com ID ${userId}?`;
    } else if (action === 'reactivate') {
      message = `Tem certeza de que deseja reativar o utilizador com ID ${userId}?`;
    } else if (action === 'delete') {
      message = `Tem certeza de que deseja excluir o utilizador com ID ${userId}?`;
    }

    setModalData({ userId, action, message });
    setIsModalOpen(true);
  };

  if (loading) {
    return <div>A carregar utilizadores...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      {/* Modal de confirmação */}
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
          {getUsersForPage(currentPage).map((user) => {
            const active = Boolean(user.active); // Garante que é um booleano

            return (
              <tr key={user.id} className={active ? '' : 'suspended-user'}>
                <td style={{ textAlign: 'center' }}>{user.username}</td>
                <td style={{ textAlign: 'center' }}>{user.email}</td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <button
                      className="btn-card tabela-btn btn-danger"
                      onClick={() => handleRedirectToProfile(user.id)}
                    >
                      Consultar perfil
                    </button>
                    {active ? (
                      <button
                        className="btn-card tabela-btn btn-info"
                        onClick={() => handleOpenModal(user.id, 'suspend')}
                      >
                        Suspender
                      </button>
                    ) : (
                      <button
                        className="btn-card tabela-btn btn-success"
                        onClick={() => handleOpenModal(user.id, 'reactivate')}
                      >
                        Reativar
                      </button>
                    )}
                    <button
                      className="btn-card tabela-btn btn-edit"
                      onClick={() => handleOpenModal(user.id, 'delete')}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Paginação */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: totalPages ? totalPages : 0 }, (_, i) => i + 1).map((page) => (
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


