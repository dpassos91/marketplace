import { useNavigate } from 'react-router-dom';
import * as userAPI from '../api/UserAPI';
import useAuthStore from '../stores/authStore';

export function useAuth() {
  const navigate = useNavigate();

  const handleAuthSuccess = (userData, successMessage) => {
    useAuthStore.getState().login(userData); // Atualiza o estado do usuário no store
    localStorage.setItem('userData', JSON.stringify(userData)); // Persiste no localStorage
    alert(successMessage);
    navigate('/');
    return true;
  };

  const handleAuthError = (error, errorMessage) => {
    console.error(errorMessage, error);
    alert(errorMessage + ' Tente novamente.');
    return false;
  };

  const login = async (credentials) => {
    try {
      const userData = await userAPI.loginUser(credentials);
      useAuthStore.getState().login(userData); // Atualiza o estado do usuário no store
      localStorage.setItem('userData', JSON.stringify(userData)); // Persiste no localStorage
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
    console.log('A função de registro está sendo chamada com:', newUser); // Adicione este log
    try {
      const userData = await userAPI.registerUser(newUser);
      return handleAuthSuccess(userData, `Utilizador registado! Bem-vindo/a ${newUser.firstName}`);
    } catch (error) {
      return handleAuthError(error, 'Erro ao registar utilizador:');
    }
  };

  const logout = () => {
    console.log('Função de logout chamada'); // Adicione este log
    useAuthStore.getState().logout(); // Limpa o estado do usuário no store
    localStorage.removeItem('userData'); // Remove do localStorage
    sessionStorage.removeItem('authToken');
    console.log('userData removido da local storage'); // Adicione este log
    console.log('Conteúdo da local storage após o logout:', localStorage.getItem('userData')); // Adicione este log
    navigate('/');
  };

  return { login, register, logout };
}

