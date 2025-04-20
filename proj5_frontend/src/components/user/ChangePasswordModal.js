import React, { useState } from 'react';
import Modal from '../commons/Modal';
import { FormattedMessage, useIntl } from 'react-intl';
import { userAPI } from '../../api/userAPI';

function ChangePasswordModal({ isOpen, onClose, userId }) {
  const { formatMessage } = useIntl();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError(formatMessage({ id: 'changePassword.error.mismatch', defaultMessage: 'As passwords não coincidem.' }));
      return;
    }

    try {
      await userAPI.updatePassword(userId, formData);
      onClose();
      alert(formatMessage({ id: 'changePassword.success', defaultMessage: 'Password alterada com sucesso!' }));
    } catch (err) {
      console.error(err);
      setError(formatMessage({ id: 'changePassword.error.generic', defaultMessage: 'Erro ao alterar a password.' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formatMessage({ id: 'changePassword.title', defaultMessage: 'Alterar Password' })}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">
            <FormattedMessage id="changePassword.current" defaultMessage="Password Atual" />
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">
            <FormattedMessage id="changePassword.new" defaultMessage="Nova Password" />
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FormattedMessage id="changePassword.confirm" defaultMessage="Confirmar Nova Password" />
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="modal-actions">
          <button type="submit">
            <FormattedMessage id="changePassword.save" defaultMessage="Guardar" />
          </button>
          <button type="button" onClick={onClose}>
            <FormattedMessage id="changePassword.cancel" defaultMessage="Cancelar" />
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ChangePasswordModal;
