import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormattedMessage, useIntl } from 'react-intl'; // Para textos traduzidos
import '../App.css';

function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const intl = useIntl(); // Adiciona o hook do intl

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <>
      <main className="login">
        <div className="login-container">
          <h2><FormattedMessage id="login.title" defaultMessage="Login" /></h2>
          <form id="formulario_login" onSubmit={handleSubmit}>
            <label htmlFor="username">
              <FormattedMessage id="login.username" defaultMessage="Nome de Utilizador" />
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={intl.formatMessage({ id: 'login.placeholder.username', defaultMessage: 'Nome de Utilizador' })}
              title={intl.formatMessage({ id: 'login.error.usernameRequired', defaultMessage: 'Por favor, insira o nome de utilizador.' })} // Mensagem personalizada
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder={intl.formatMessage({ id: 'login.placeholder.password', defaultMessage: 'Password' })}
              title={intl.formatMessage({ id: 'login.error.passwordRequired', defaultMessage: 'Por favor, insira a palavra-passe.' })} // Mensagem personalizada
            />
            <button type="submit">
              <FormattedMessage id="login.submit" defaultMessage="Entrar" />
            </button>
            <Link to="/registo">
              <button type="button">
                <FormattedMessage id="login.register" defaultMessage="Registar" />
              </button>
            </Link>
          </form>
        </div>
      </main>
    </>
  );
}

export default LoginPage;
