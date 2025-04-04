import React from 'react';
import styles from './UserManagementButtons.module.css';

const UserRow = React.memo(({ user, onRedirect, onAction }) => {
  const active = Boolean(user.active);

  return (
    <tr className={active ? '' : 'suspended-user'}>
      <td style={{ textAlign: 'center' }}>{user.username}</td>
      <td style={{ textAlign: 'center' }}>{user.email}</td>
      <td style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button
            className={`${styles.btnCard} ${styles.btnInfo}`}
            onClick={() => onRedirect(user.id)}
          >
            Consultar perfil
          </button>
          {active ? (
            <button
              className={`${styles.btnCard} ${styles.btnEdit}`}
              onClick={() => onAction(user.id, 'suspend')}
            >
              Suspender
            </button>
          ) : (
            <button
              className={`${styles.btnCard} ${styles.btnDanger}`}
              onClick={() => onAction(user.id, 'reactivate')}
            >
              Reativar
            </button>
          )}
          <button
            className={`${styles.btnCard} ${styles.btnDanger}`}
            onClick={() => onAction(user.id, 'delete')}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
});

export default UserRow;
