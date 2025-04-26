import { useState, useEffect } from "react";
import dashboardAPI from "../api/dashboardAPI"; // Ajusta o caminho se for diferente

function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await dashboardAPI.getOverview(); // método para ir buscar tudo
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export default useDashboardData;
