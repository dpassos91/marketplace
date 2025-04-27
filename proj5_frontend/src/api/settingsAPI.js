
import { apiConfig } from "./apiConfig"; 

const { apiCall, API_ENDPOINTS } = apiConfig;

const settingsAPI = {
  getSettings: () => apiCall(API_ENDPOINTS.settings.getSettings, {
    method: "GET"
  }),

  updateSettings: (settingsData) => apiCall(API_ENDPOINTS.settings.updateSettings, {
    method: "PUT",
    body: JSON.stringify(settingsData)
  })
};

export default settingsAPI;
