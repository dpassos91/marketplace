import React, { useState, useEffect } from 'react';
import Modal from '../components/commons/Modal';
import { authAPI } from '../api/authAPI';
import { FormattedMessage, useIntl } from 'react-intl';

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const intl = useIntl();

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setStatusMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await authAPI.requestPasswordReset(email);
      setStatusMessage(
        intl.formatMessage({
          id: 'forgotPassword.success',
          defaultMessage: 'Foi enviado um link de recuperação (ver consola). Este link é válido por 15 minutos.',
        })
      );
      console.log(
        '🔗 Link de recuperação:',
        `http://localhost:3000/reset-password?token=${result.token}`
      );
    } catch (error) {
      console.error('Erro ao pedir recuperação:', error);
      setStatusMessage(
        intl.formatMessage({
          id: 'forgotPassword.error',
          defaultMessage: 'Não foi possível enviar o pedido. Verifique o email.',
        })
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={intl.formatMessage({ id: 'forgotPassword.title', defaultMessage: 'Recuperar Password' })}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">
            <FormattedMessage id="forgotPassword.email" defaultMessage="Email:" />
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button type="submit">
            <FormattedMessage id="forgotPassword.submit" defaultMessage="Pedir recuperação" />
          </button>
          <button type="button" onClick={onClose}>
            <FormattedMessage id="forgotPassword.close" defaultMessage="Fechar" />
          </button>
        </div>
        {statusMessage && <p>{statusMessage}</p>}
      </form>
    </Modal>
  );
}

export default ForgotPasswordModal;

