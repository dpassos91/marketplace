import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormInput } from '../hooks/useFormInput';

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}

function RegistrationForm() {
    const [formData, handleInputChange] = useFormInput({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        picture: '',
    });
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();

    const validatePasswords = () => {
        const { password, confirmPassword } = formData;
        if (!validatePassword(password)) {
            return 'A password deve ter pelo menos 8 caracteres, incluindo números e letras.';
        }
        if (password !== confirmPassword) {
            return 'As passwords não coincidem.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordError = validatePasswords();
        if (passwordError) {
            alert(passwordError);
            return;
        }

        try {
            const response = await userAPI.registerUser(formData);
            if (response.success) {
                alert('Registo bem-sucedido! Redirecionando para o login...');
                navigate('/login');
            } else {
                alert('Ocorreu um erro ao registar o utilizador.');
            }
        } catch (error) {
            console.error('Erro durante o registo:', error);
            alert('Ocorreu um erro ao registar o utilizador.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="firstName">Nome:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="lastName">Apelido:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                />
                 {usernameError && <p className="error-message">{usernameError}</p>}
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="confirmPassword">Confirme a Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="phone">Telefone:</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="picture">Fotografia:</label>
                <input
                    type="text"
                    id="picture"
                    name="picture"
                    value={formData.picture}
                    onChange={handleInputChange}
                />
            </div>
            <button type="submit">Registar</button>
        </form>
    );
}

