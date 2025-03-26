import React, { useState } from 'react';
import { userAPI } from '../../api/userAPI'
import useFetchUsers from '../../hooks/useFetchUsers';

const USERS_PER_PAGE = 10;

const UserTable = () => {
  const { users, loading, error } = useFetchUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const getUsersForPage = (page) => {
    const start = (page - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    return users.slice(start, end);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSuspendUser = async (userId) => {
    try {
      await userAPI.suspendUser(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await userAPI.reactivateUser(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
    } catch (err) {
      console.error(err);
    }
  };

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
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {getUsersForPage(currentPage).map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td>{user.status}</td>
              <td>
                {user.status === 'active' ? (
                  <button onClick={() => handleSuspendUser(user.id)}>Suspender</button>
                ) : (
                  <button onClick={() => handleReactivateUser(user.id)}>Reativar</button>
                )}
                <button onClick={() => handleDeleteUser(user.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => handlePageChange(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
