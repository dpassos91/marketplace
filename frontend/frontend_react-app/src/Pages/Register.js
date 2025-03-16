import React, { useState } from 'react';
import { useAuth } from '../hooks/UseAuth';

function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    picture: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As passwords não coincidem.');
      return;
    }
    try {
      await register(formData);
      alert('Utilizador registado! Bem-vindo/a, ' + formData.firstName);
      // Redirect to login page or home page
    } catch (error) {
      alert('Erro ao registar utilizador. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <>
      <main className="login">
        <div className="registo-container">
          <h2>Novo Registo</h2>
          <form id="formulario_novo_registo" onSubmit={handleSubmit}>
            <div className="formulario_novo_registo">
              <label htmlFor="firstName">Primeiro nome</label>
              <input type="text" id="firstName" name="firstName" placeholder="Digite o seu primeiro nome" required onChange={handleChange} />
              
              <label htmlFor="lastName">Último nome</label>
              <input type="text" id="lastName" name="lastName" placeholder="Digite o seu último nome" required onChange={handleChange} />
              
              <label htmlFor="username">Nome de Utilizador</label>
              <input type="text" id="username" name="username" placeholder="Escolha o seu username" required onChange={handleChange} />
              
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" placeholder="Digite a sua password" required onChange={handleChange} />
              
              <label htmlFor="confirmPassword">Confirme a Password:</label>
              <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirme a sua password" required onChange={handleChange} />
              
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" placeholder="Digite o seu email" required onChange={handleChange} />
              
              <label htmlFor="phone">Telefone:</label>
              <input type="text" id="phone" name="phone" maxLength="9" minLength="9" placeholder="--- --- ---" required onChange={handleChange} />
              
              <label htmlFor="picture">Fotografia</label>
              <input type="url" id="picture" name="picture" placeholder="Cole o link da imagem aqui" required onChange={handleChange} />
              
              <button type="submit" id="registarButton">Registar</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default RegisterPage;
