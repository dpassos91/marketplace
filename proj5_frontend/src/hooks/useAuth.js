import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/userAPI';
import useAuthStore from '../stores/authStore';
import { useIntl } from 'react-intl';

export function useAuth() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { login: loginStore, logout: logoutStore, user: currentUser } = useAuthStore();

  const handleAuthError = (error, errorMessageId, defaultMessage) => {
    console.error(defaultMessage, error);
    alert(formatMessage({ id: errorMessageId, defaultMessage }) + ' ' + formatMessage({ id: 'auth.tryAgain', defaultMessage: 'Tente novamente.' }));
    return false;
  };

  const login = async (credentials) => {
    try {
      const userData = await userAPI.loginUser(credentials);
      const userDataToStore = {
        id: userData.id,
        name: userData.firstName + ' ' + userData.lastName,
        picture: userData.picture,
        admin: userData.admin
      };
      useAuthStore.getState().login(userDataToStore);
      localStorage.setItem('userData', JSON.stringify(userDataToStore));
      alert(
        formatMessage(
          {
            id: 'auth.login.success',
            defaultMessage: 'Login bem sucedido! Bem-vindo/a {name}!'
          },
          { name: `${userData.firstName} ${userData.lastName}` }
        )
      );
      navigate('/');
      return true;
    } catch (error) {
      console.error('Login falhou:', error);
      alert(formatMessage({ id: 'auth.login.failed', defaultMessage: 'Login falhou! Por favor verifique as suas credenciais.' }));
      return false;
    }
  };

  const register = async (newUser) => {
    console.log('A função de registro está sendo chamada com:', newUser);
    try {
      const userData = await userAPI.registerUser(newUser);
      alert(formatMessage({ id: 'auth.register.success', defaultMessage: 'Utilizador registado! Por favor, faça login.' }));
      navigate('/login');
      return true;
    } catch (error) {
      return handleAuthError(error, 'auth.register.failed', 'Erro ao registar utilizador:');
    }
  };  

  const logout = async () => {
    console.log('Função de logout chamada');
    try {
      await userAPI.logoutUser();

      logoutStore();
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');

      console.log('userData removido da local storage');
      console.log('Conteúdo da local storage após o logout:', localStorage.getItem('userData'));

      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert(formatMessage({ id: 'auth.logout.failed', defaultMessage: 'Houve um problema ao fazer logout. Por favor, tente novamente.' }));
    }
  };

  return { login, register, logout, currentUser };
}
