import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import { userAPI } from '../../api/userAPI';
import { useFormInput } from '../../hooks/useFormInput'; // Importe o hook

function LoginForm() {
  const [credentials, handleInputChange] = useFormInput({ username: '', password: '' }); // Use o hook
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await userAPI.loginUser(credentials);
      login(userData);
      alert(`Login bem sucedido! Bem-vindo/a ${userData.firstName} ${userData.lastName}!`);
      navigate('/');
    } catch (error) {
      alert('Login falhou! Por favor verifique as suas credenciais.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={credentials.username}
        onChange={handleInputChange} // Use o handleInputChange do hook
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={credentials.password}
        onChange={handleInputChange} // Use o handleInputChange do hook
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;

