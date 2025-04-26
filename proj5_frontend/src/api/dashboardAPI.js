import { apiConfig} from "./apiConfig"; 

const { apiCall, API_ENDPOINTS } = apiConfig;

const dashboardAPI = {
  getOverview: () => apiCall.get(API_ENDPOINTS.dashboardOverview),
};

export default dashboardAPI;