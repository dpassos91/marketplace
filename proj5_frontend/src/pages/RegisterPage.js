import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

function RegisterPage() {
  const { formatMessage } = useIntl();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
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
      alert(formatMessage({ id: 'registeralert.passwordsMismatch', defaultMessage: 'As passwords não coincidem.' }));
      return;
    }

  const dataToSend = { ...formData };
  delete dataToSend.confirmPassword;

    console.log('Dados a serem enviados:', formData); // Adicione este log


    try {
      const success = await register(dataToSend);
      if (success) {
        navigate('/login');
      } else {
        alert(formatMessage({ id: 'registeralert.registerFailed', defaultMessage: 'Erro ao registar utilizador. Tente novamente.'}));
      }
    } catch (error) {
      alert(formatMessage({ id: 'registeralert.registerFailed', defaultMessage: 'Erro ao registar utilizador. Tente novamente.'}));
      console.error(error);
    }
  };

  return (
    <>
      <main className="login">
        <div className="registo-container">
          <h2>
            <FormattedMessage id="register.title" defaultMessage="Novo Registo" />
          </h2>
          <form id="formulario_novo_registo" onSubmit={handleSubmit}>
            <div className="formulario_novo_registo">
              <label htmlFor="firstName">
                {formatMessage({ id: 'register.firstName', defaultMessage: 'Primeiro nome' })}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder={formatMessage({
                  id: 'registerplaceholder.firstName',
                  defaultMessage: 'Digite o seu primeiro nome',
                })}
                required
                onChange={handleChange}
              />

              <label htmlFor="lastName">
                {formatMessage({ id: 'register.lastName', defaultMessage: 'Último nome' })}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder={formatMessage({
                  id: 'registerplaceholder.lastName',
                  defaultMessage: 'Digite o seu último nome',
                })}
                required
                onChange={handleChange}
              />

              <label htmlFor="username">
                {formatMessage({ id: 'register.username', defaultMessage: 'Nome de Utilizador' })}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder={formatMessage({
                  id: 'registerplaceholder.username',
                  defaultMessage: 'Escolha o seu username',
                })}
                required
                onChange={handleChange}
              />

              <label htmlFor="password">
                {formatMessage({ id: 'register.password', defaultMessage: 'Password' })}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder={formatMessage({
                  id: 'registerplaceholder.password',
                  defaultMessage: 'Digite a sua password',
                })}
                required
                onChange={handleChange}
              />

              <label htmlFor="confirmPassword">
                {formatMessage({ id: 'register.confirmPassword', defaultMessage: 'Confirme a Password' })}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder={formatMessage({
                  id: 'registerplaceholder.confirmPassword',
                  defaultMessage: 'Confirme a sua password',
                })}
                required
                onChange={handleChange}
              />

              <label htmlFor="email">
                {formatMessage({ id: 'register.email', defaultMessage: 'Email' })}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={formatMessage({
                  id: 'registerplaceholder.email',
                  defaultMessage: 'Digite o seu email',
                })}
                required
                onChange={handleChange}
              />

              <label htmlFor="phone">
                {formatMessage({ id: 'register.phone', defaultMessage: 'Telefone' })}
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                maxLength="9"
                minLength="9"
                placeholder={formatMessage({
                  id: 'registerplaceholder.phone',
                  defaultMessage: '--- --- ---',
                })}
                required
                onChange={handleChange}
              />

              <label htmlFor="picture">
                {formatMessage({ id: 'register.picture', defaultMessage: 'Fotografia' })}
              </label>
              <input
                type="url"
                id="picture"
                name="picture"
                placeholder={formatMessage({
                  id: 'registerplaceholder.picture',
                  defaultMessage: 'Cole o link da imagem aqui',
                })}
                required
                onChange={handleChange}
              />

              <button type="submit" id="registarButton">
                <FormattedMessage id="register.submit" defaultMessage="Registar" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;
