import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormattedMessage, useIntl } from 'react-intl'; // Para textos traduzidos
import './LoginPage.css';
import ForgotPasswordModal from './ForgotPasswordModal';

function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const intl = useIntl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
  };

  const handleInvalid = (e) => {
    const errorId = `login.${e.target.name}.errorRequired`;
    e.target.setCustomValidity(intl.formatMessage({ id: errorId }));
  };

  const handleChange = (e) => {
    e.target.setCustomValidity(''); // Limpa a mensagem de validação customizada após ser mostrada uma vez
    if (e.target.name === 'username') {
      setUsername(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  return (
    <>
      <main className="login">
        <div className="login-container">
          <h2><FormattedMessage id="login.title" defaultMessage="Login" /></h2>
          <form id="formulario_login" onSubmit={handleSubmit}>
            <label htmlFor="username">
              <FormattedMessage id="login.username" defaultMessage="Username" />
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={handleChange}
              onInvalid={handleInvalid}
              placeholder={intl.formatMessage({ id: 'login.placeholder.username', defaultMessage: 'Nome de Utilizador' })}
              title={intl.formatMessage({ id: 'login.error.usernameRequired', defaultMessage: 'Por favor insira o seu nome de utilizador.' })}
            />
            <label htmlFor="password">
              <FormattedMessage id="login.password" defaultMessage="Password" />
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={handleChange}
              onInvalid={handleInvalid}
              placeholder={intl.formatMessage({ id: 'login.placeholder.password', defaultMessage: 'Password' })}
              title={intl.formatMessage({ id: 'login.error.passwordRequired', defaultMessage: 'Please enter your password.' })}
            />
            <button type="submit">
              <FormattedMessage id="login.submit" defaultMessage="Log In" />
            </button>
            <Link to="/registo">
              <button type="button">
                <FormattedMessage id="login.register" defaultMessage="Register" />
              </button>
            </Link>
            <p className="forgot-password">
  <span onClick={() => {
    setIsModalOpen(true);
  }}>
    <FormattedMessage id="login.forgotPassword" defaultMessage="Esqueceu-se da sua password?" />
  </span>
</p>
          </form>
        </div>
        <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </>
  );
}

export default LoginPage;