import { useAuth } from './useAuth';
import { userAPI } from '../api/userAPI';

function useHardDeleteUser() {
  const { deleteUser } = useAuth();

  const hardDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      deleteUser(userId); // Atualizar o contexto de autenticação
    } catch (error) {
      console.error('Erro ao eliminar utilizador:', error);
      throw error;
    }
  };

  return { hardDeleteUser };
}

export default useHardDeleteUser;
