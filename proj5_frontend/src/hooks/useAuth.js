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
  
      const fullName = `${userData.firstName} ${userData.lastName}`;
      const userDataToStore = {
        id: userData.id,
        name: fullName,
        picture: userData.picture,
        admin: userData.admin
      };
  
      useAuthStore.getState().login(userDataToStore);
      localStorage.setItem('userData', JSON.stringify(userDataToStore));
  
      alert(
        formatMessage(
          { id: 'auth.login.success', defaultMessage: 'Login bem sucedido! Bem-vindo/a {name}!' },
          { name: fullName }
        )
      );
  
      navigate('/');
      return true;
  
    } catch (error) {
      console.error('Login falhou:', error);
  
      // ⚠️ Conta ainda não confirmada

if (error.status === 403 && error.message.includes('confirmada')) {
  alert(formatMessage({
    id: "auth.login.unconfirmed",
    defaultMessage: "A sua conta ainda não está confirmada. Verifique o link de confirmação."
  }));

  const tokenMatch = error.message.match(/Token:\s(.+)/);
  const token = tokenMatch ? tokenMatch[1].trim() : null;

  if (token) {
    console.warn("🔁 Link de confirmação:");
    console.warn(`http://localhost:3000/confirmar?token=${token}`);
  } else {
    console.warn("⚠️ Token não encontrado na mensagem.");
  }
}
 else {
        // ❌ Login inválido
        alert(formatMessage({
          id: 'auth.login.failed',
          defaultMessage: 'Login falhou! Por favor verifique as suas credenciais.'
        }));
      }
  
      return false;
    }
  };  

  const register = async (newUser) => {
    console.log('A função de registro está sendo chamada com:', newUser);
    try {
      const userData = await userAPI.registerUser(newUser);
  
      alert(formatMessage({ id: 'auth.register.success', defaultMessage: 'Utilizador registado! Por favor, faça login.' }));
  
      // Retorna os dados completos para que o componente os possa usar
      return userData;
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
  
      alert(formatMessage({
        id: 'auth.logout.success',
        defaultMessage: 'Logout realizado com sucesso! Até breve :)'
      }));
  
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert(formatMessage({
        id: 'auth.logout.failed',
        defaultMessage: 'Houve um problema ao fazer logout. Por favor, tente novamente.'
      }));
    }
  };
  
  return { login, register, logout, currentUser };
}
