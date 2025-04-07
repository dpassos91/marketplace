import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormattedMessage } from 'react-intl'; // Para textos traduzidos
import '../App.css';

function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <>
      <main className="login">
        <div className="login-container">
          {/* Título traduzido */}
          <h2><FormattedMessage id="login.title" defaultMessage="Login" /></h2>
          <form id="formulario_login" onSubmit={handleSubmit}>
            {/* Nome de Utilizador */}
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
            />
            {/* Password */}
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
            />
            {/* Botão Entrar */}
            <button type="submit">
              <FormattedMessage id="login.submit" defaultMessage="Entrar" />
            </button>
            {/* Botão Registar */}
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
