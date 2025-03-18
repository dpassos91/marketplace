import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userAPI from '../api/UserAPI';

// Funções utilitárias para manipular localStorage
const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem('userData');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Error parsing stored user data:", error);
        return null;
    }
};

const setStoredUser = (user) => {
    try {
        localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
        console.error("Error saving user data:", error);
    }
};

const clearStoredUser = () => {
    try {
        localStorage.removeItem('userData');
    } catch (error) {
        console.error("Error clearing user data:", error);
    }
};

export function useAuth() {
    const [user, setUser] = useState(getStoredUser());
    const navigate = useNavigate();

    // Sincronizar estado com mudanças no localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setUser(getStoredUser());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = async (credentials) => {
        try {
            const userData = await userAPI.loginUser(credentials);
            setStoredUser(userData);
            setUser(userData);
            alert(`Login bem sucedido! Bem-vindo/a ${userData.firstName} ${userData.lastName}!`);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Login falhou:', error);
            alert('Login falhou! Por favor verifique as suas credenciais.');
            return false;
        }
    };

    const register = async (newUser) => {
        try {
            const userData = await userAPI.registerUser(newUser);
            setStoredUser(userData); // Autentica automaticamente após registro
            setUser(userData);
            alert(`Utilizador registado! Bem-vindo/a ${newUser.firstName}`);
            navigate('/');
            return true;
        } catch (error) {
            console.error('Erro ao registar utilizador:', error);
            alert('Erro ao registar utilizador. Tente novamente.');
            return false;
        }
    };

    const logout = () => {
        clearStoredUser();
        setUser(null);
        navigate('/');
    };

    return { user, login, register, logout };
}
