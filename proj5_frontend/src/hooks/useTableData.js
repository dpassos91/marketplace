import { useState, useEffect, useCallback } from 'react';

function useTableData(fetchFunc) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunc();
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunc]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Função para remover um item com base no seu ID da lista de dados
  const removeItem = useCallback((itemId) => {
    setData((prevData) => prevData.filter((item) => item.id !== itemId));
  }, []);

  return { data, loading, error, refetch, removeItem, setData };
}

export default useTableData;
