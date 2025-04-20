import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/authAPI';
import { FormattedMessage, useIntl } from 'react-intl';
import './LoginPage.css';

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      await authAPI.resetPassword(token, newPassword);
      alert(intl.formatMessage({
        id: 'reset.success',
        defaultMessage: 'Password redefinida com sucesso!'
      }));
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.body || 'Ocorreu um erro ao redefinir a password.');
    }
  };

  return (
    <main className="login">
      <div className="login-container">
        <h2><FormattedMessage id="reset.title" defaultMessage="Redefinir Password" /></h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form id="formulario_login" onSubmit={handleSubmit}>
          <label htmlFor="newPassword">
            <FormattedMessage id="reset.newPassword" defaultMessage="Nova Password" />
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">
            <FormattedMessage id="reset.confirmPassword" defaultMessage="Confirmar Password" />
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">
            <FormattedMessage id="reset.submit" defaultMessage="Submeter" />
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;

