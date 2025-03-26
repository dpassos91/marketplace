import React, { useState, useEffect } from 'react';
import useFetchUsers from '../../hooks/useFetchUsers';
import { userAPI } from '../../api/userAPI';

const USERS_PER_PAGE = 10;

const UserTable = () => {
  const { users, loading, error } = useFetchUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users?.length / USERS_PER_PAGE);

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

  const handleSuspendUser = async (userId) => {
    try {
      await userAPI.suspendUser(userId);
      alert(`Utilizador ${userId} suspenso com sucesso!`);
      //window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao suspender utilizador.');
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await userAPI.reactivateUser(userId);
      alert(`Utilizador ${userId} reativado com sucesso!`);
      //window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao reativar utilizador.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      alert(`Utilizador ${userId} excluído com sucesso!`);
      //window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir utilizador.');
    }
  };

  useEffect(() => {
    if (users) {
      getUsersForPage(currentPage).forEach(user => {
        console.log(`User ${user.username} is_active:`, user.is_active, typeof user.is_active);
      });
    }
  }, [users, currentPage]);

  if (loading) {
    return <div>A carregar utilizadores...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
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
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        Suspender
                      </button>
                    ) : (
                      <button
                        className="btn-card tabela-btn btn-success"
                        onClick={() => handleReactivateUser(user.id)}
                      >
                        Reativar
                      </button>
                    )}
                    <button
                      className="btn-card tabela-btn btn-edit"
                      onClick={() => handleDeleteUser(user.id)}
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

