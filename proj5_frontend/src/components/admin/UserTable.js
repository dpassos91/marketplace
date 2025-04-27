import React, { useState, useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { userAPI } from '../../api/userAPI';
import usePaginationTable from '../../hooks/usePaginationTable';
import useTableData from '../../hooks/useTableData';
import Pagination from '../commons/Pagination';
import TableDataState from './TableDataState';
import './UserTable.css';
import { useNavigate } from 'react-router-dom';

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
            <button className="btn-card tabela-btn btn-info" onClick={() => onAction(user.username, user.id, 'suspend')}>
              <FormattedMessage id="admin.userTable.suspend" defaultMessage="Suspender" />
            </button>
          ) : (
            <button className="btn-card tabela-btn btn-success" onClick={() => onAction(user.username, user.id, 'reactivate')}>
              <FormattedMessage id="admin.userTable.reactivate" defaultMessage="Reativar" />
            </button>
          )}
          <button className="btn-card tabela-btn btn-edit" onClick={() => onAction(user.username, user.id, 'delete')}>
            <FormattedMessage id="admin.userTable.delete" defaultMessage="Eliminar" />
          </button>
        </div>
      </td>
    </tr>
  );
});

const UserTable = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  
  const {
    data: users,
    loading,
    error,
    refetch,
    removeItem,
    setData
  } = useTableData(userAPI.getAllUsers);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    handlePageChange,
  } = usePaginationTable(users, USERS_PER_PAGE);

  const handleRedirectToProfile = useCallback((userId) => {
    navigate(`/painel-utilizador/${userId}`);
  }, [navigate]);

  const handleAction = useCallback(async (username, userId, action) => {
    const confirmationMessage = intl.formatMessage(
      { id: `admin.window.confirm.${action}` },
      { userId, username }
    );

    if (window.confirm(confirmationMessage)) {
      try {
        if (action === 'suspend') await userAPI.updateUserStatus(userId, false );
        else if (action === 'reactivate') await userAPI.updateUserStatus(userId, true );
        else if (action === 'delete') await userAPI.deleteUser(userId);

  

        alert(intl.formatMessage({ id: `admin.alert.success.${action}` }, { username, userId }));
        refetch(); // ou usa removeItem(userId) se preferires performance
      } catch (err) {
        console.error(err);
        alert(intl.formatMessage({ id: `admin.alert.error.${action}` }));
      }
    }
  }, [refetch, intl]);

  const isEmpty = !users || users.length === 0;

  if (loading || error || isEmpty) {
    return (
      <TableDataState
        loading={loading}
        error={error}
        message={isEmpty ? 'empty' : null}
        messagePrefix="admin.userTable"
        image="/img/sem-utilizadores.png"
      />
    );
  }

  return (
    <div>
      <h2 className="admin-title">
        <FormattedMessage id="admin.userTable.title" defaultMessage="Gestão de Utilizadores" />
      </h2>
      <table>
        <thead>
          <tr>
            <th><FormattedMessage id="admin.userTable.username" defaultMessage="Username" /></th>
            <th><FormattedMessage id="admin.userTable.email" defaultMessage="Email" /></th>
            <th><FormattedMessage id="admin.userTable.actions" defaultMessage="Ações" /></th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onRedirect={handleRedirectToProfile}
              onAction={handleAction}
            />
          ))}
        </tbody>
      </table>

      <Pagination
  totalPages={totalPages}
  currentPage={currentPage}
  onPageChange={handlePageChange}
/>
    </div>
  );
};



export default UserTable;




