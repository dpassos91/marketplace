import React, { useState, useCallback, useMemo } from 'react';
import useFetchUsers from '../../hooks/useFetchUsers';
import { userAPI } from '../../api/userAPI';
import UserRow from './UserRow'; 
import './Table.css'

const USERS_PER_PAGE = 10;

const UserTable = () => {
  const { users, loading, error, refetch } = useFetchUsers();
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleAction = useCallback(async (userId, action) => {
    const confirmationMessages = {
      suspend: `Tem certeza de que deseja suspender o utilizador com ID ${userId}?`,
      reactivate: `Tem certeza de que deseja reativar o utilizador com ID ${userId}?`,
      delete: `Tem certeza de que deseja excluir o utilizador com ID ${userId}?`,
    };

    if (window.confirm(confirmationMessages[action])) {
      try {
        let apiResponse = null;
        if (action === 'suspend') {
          apiResponse = await userAPI.suspendUser(userId);
        } else if (action === 'reactivate') {
          apiResponse = await userAPI.reactivateUser(userId);
        } else if (action === 'delete') {
          apiResponse = await userAPI.deleteUser(userId);
        }

        const successMessages = {
          suspend: `O utilizador ${userId} foi suspenso com sucesso.`,
          reactivate: `O utilizador ${userId} foi reativado com sucesso.`,
          delete: `O utilizador ${userId} foi eliminado permanentemente.`,
        };

        alert(successMessages[action]);

        refetch(); // Atualiza a lista de usuários
      } catch (err) {
        console.error(err);
        alert(`Erro ao realizar a ação: ${action}`);
      }
    }
  }, [refetch]);

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
              onAction={handleAction}
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




