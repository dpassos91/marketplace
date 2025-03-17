import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';
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
          <h2>Login</h2>
          <form id="formulario_login" onSubmit={handleSubmit}>
            <label htmlFor="username">Nome de Utilizador</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Entrar</button>
            <Link to="/Register">
              <button type="button">Registar</button>
            </Link>
          </form>
        </div>
      </main>
    </>
  );
}

export default LoginPage;
