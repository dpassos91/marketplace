import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/userAPI';
import useAuthStore from '../stores/authStore';

export function useAuth() {
  const navigate = useNavigate();
  const { login: loginStore, logout: logoutStore, user: currentUser } = useAuthStore();

  const handleAuthSuccess = (userData, successMessage) => {
    loginStore(userData); // Atualiza o estado do utilizador no store
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
      loginStore(userData); // Atualiza o estado do utilizador no store
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
    console.log('A função de registro está sendo chamada com:', newUser);
    try {
      const userData = await userAPI.registerUser(newUser);
      alert('Utilizador registado! Por favor, faça login.');
      navigate('/login'); // Redireciona para a página de login
      return true;
    } catch (error) {
      return handleAuthError(error, 'Erro ao registar utilizador:');
    }
  };  

  const logout = async () => {
    console.log('Função de logout chamada');
    try {
      // Chama a API de logout no backend
      await userAPI.logoutUser();
  
      // Limpa o estado local e armazenamento
      logoutStore();
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
  
      console.log('userData removido da local storage');
      console.log('Conteúdo da local storage após o logout:', localStorage.getItem('userData'));
  
      // Redireciona para a página inicial
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Houve um problema ao fazer logout. Por favor, tente novamente.');
    }
  };

  return { login, register, logout, currentUser };
}
