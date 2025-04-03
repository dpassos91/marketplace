import { apiConfig } from './apiConfig';

const { apiCall, API_ENDPOINTS } = apiConfig;

const getAllCategories = async () => {
  return await apiCall(API_ENDPOINTS.categories.all);
};

const getCategoryById = async (categoryId) => {
  return await apiCall(API_ENDPOINTS.categories.byId(categoryId));
};

const addCategory = async (category) => {
  return await apiCall(API_ENDPOINTS.categories.create, {
    method: 'POST',
    body: JSON.stringify(category),
  });
};

const updateCategory = async (categoryId, updatedCategory) => {
  return await apiCall(API_ENDPOINTS.categories.update(categoryId), {
    method: 'PUT',
    body: JSON.stringify(updatedCategory),
  });
};

const deleteCategory = async (categoryId) => {
  return await apiCall(API_ENDPOINTS.categories.delete(categoryId), {
    method: 'DELETE',
  });
};

const getCategoryByName = async (name) => {
  return await apiCall(API_ENDPOINTS.categories.byName(name));
};

const getPaginatedCategories = async (page, size) => {
  return await apiCall(API_ENDPOINTS.categories.paginated(page, size));
};

const getCategoryCount = async () => {
  return await apiCall(API_ENDPOINTS.categories.count);
};

export const categoryAPI = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryByName,
  getPaginatedCategories,
  getCategoryCount
};
