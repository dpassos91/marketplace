import { useState, useEffect } from 'react';
import { userAPI } from '../api/userAPI';

function useFetchUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedUsers = await userAPI.getTotalUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError(err.message || 'Ocorreu um erro ao carregar os utilizadores.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}

export default useFetchUsers;
