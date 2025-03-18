import { API_ENDPOINTS, apiCall } from '../api/ApiConfig';

export const categoryAPI = {
  getAllCategories: async () => {
    return await apiCall(API_ENDPOINTS.categories.all);
    console.log('URL das categorias:', API_ENDPOINTS.categories.all);
  },

  getCategoryById: async (categoryId) => {
    return await apiCall(API_ENDPOINTS.categories.byId(categoryId));
  },

  addCategory: async (category) => {
    return await apiCall(API_ENDPOINTS.categories.create, {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  updateCategory: async (categoryId, updatedCategory) => {
    return await apiCall(API_ENDPOINTS.categories.update(categoryId), {
      method: 'PUT',
      body: JSON.stringify(updatedCategory),
    });
  },

  deleteCategory: async (categoryId) => {
    return await apiCall(API_ENDPOINTS.categories.delete(categoryId), {
      method: 'DELETE',
    });
  },

  getCategoryByName: async (name) => {
    return await apiCall(API_ENDPOINTS.categories.byName(name));
  },

  getPaginatedCategories: async (page, size) => {
    return await apiCall(API_ENDPOINTS.categories.paginated(page, size));
  },

  getCategoryCount: async () => {
    return await apiCall(API_ENDPOINTS.categories.count);
  }
};
