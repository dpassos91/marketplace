
import { userAPI } from '../api/userAPI';

function useSoftDeleteUser() {
  const softDeleteUser = async (userId) => {
    try {
      await userAPI.suspendUser(userId);
    } catch (error) {
      console.error('Erro ao suspender utilizador:', error);
      throw error;
    }
  };

  return { softDeleteUser };
}

export default useSoftDeleteUser;
