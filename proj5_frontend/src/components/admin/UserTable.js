import React, { useState, useCallback, useMemo } from 'react';
import useTableData from '../../hooks/useTableData';
import { userAPI } from '../../api/userAPI';
import { FormattedMessage, useIntl } from 'react-intl';
import SpinnerLeaf from '../commons/SpinnerLeaf';
import './UserTable.css';

const USERS_PER_PAGE = 10;

const UserRow = React.memo(({ user, onRedirect, onAction }) => {
  const active = Boolean(user.active);

  return (
    <tr className={active ? '' : 'suspended-user'}>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>
        <div className="table-actions">
          <button className="btn-card tabela-btn btn-danger" onClick={() => onRedirect(user.id)}>
            <FormattedMessage id="admin.userTable.profile" defaultMessage="Consultar perfil" />
          </button>
          {active ? (
            <button className="btn-card tabela-btn btn-info" onClick={() => onAction(user.id, 'suspend')}>
              <FormattedMessage id="admin.userTable.suspend" defaultMessage="Suspender" />
            </button>
          ) : (
            <button className="btn-card tabela-btn btn-success" onClick={() => onAction(user.id, 'reactivate')}>
              <FormattedMessage id="admin.userTable.reactivate" defaultMessage="Reativar" />
            </button>
          )}
          <button className="btn-card tabela-btn btn-edit" onClick={() => onAction(user.id, 'delete')}>
            <FormattedMessage id="admin.userTable.delete" defaultMessage="Eliminar" />
          </button>
        </div>
      </td>
    </tr>
  );
});

const UserTable = () => {
  const intl = useIntl();

  const {
    data: users,
    loading,
    error,
    refetch,
    removeItem, // disponível se quiseres usar para delete direto
    setData     // disponível para atualizações manuais
  } = useTableData(userAPI.getTotalUsers);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil((users?.length || 0) / USERS_PER_PAGE), [users]);

  const getUsersForPage = useCallback((page) => {
    if (!users) return [];
    const start = (page - 1) * USERS_PER_PAGE;
    return users.slice(start, start + USERS_PER_PAGE);
  }, [users]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleRedirectToProfile = useCallback((userId) => {
    window.location.href = `http://localhost:3000/profile/${userId}`;
  }, []);

  const handleAction = useCallback(async (userId, action) => {
    const confirmationMessage = intl.formatMessage(
      { id: `admin.window.confirm.${action}` },
      { userId }
    );

    if (window.confirm(confirmationMessage)) {
      try {
        if (action === 'suspend') await userAPI.suspendUser(userId);
        else if (action === 'reactivate') await userAPI.reactivateUser(userId);
        else if (action === 'delete') await userAPI.deleteUser(userId);

        alert(intl.formatMessage({ id: `admin.alert.success.${action}` }, { userId }));
        refetch(); // ou usa removeItem(userId) se preferires performance
      } catch (err) {
        console.error(err);
        alert(intl.formatMessage({ id: `admin.alert.error.${action}` }));
      }
    }
  }, [refetch, intl]);

  if (loading) {
    return (
      <div className="loading-users">
        <SpinnerLeaf />
        <div>
          <FormattedMessage id="admin.userTable.loading" defaultMessage="A carregar utilizadores..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-users">
        <img src="/img/erro-utilizadores.png" alt="Erro ao carregar utilizadores" />
        <p>
          <FormattedMessage id="admin.userTable.error" defaultMessage="Erro ao carregar utilizadores." />
        </p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="empty-users">
        <img src="/img/sem-utilizadores.png" alt="Nenhum utilizador encontrado" />
        <p>
          <FormattedMessage id="admin.userTable.empty" defaultMessage="Nenhum utilizador encontrado." />
        </p>
      </div>
    );
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th><FormattedMessage id="admin.userTable.username" defaultMessage="Username" /></th>
            <th><FormattedMessage id="admin.userTable.email" defaultMessage="Email" /></th>
            <th><FormattedMessage id="admin.userTable.actions" defaultMessage="Ações" /></th>
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

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? 'active' : ''}
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





