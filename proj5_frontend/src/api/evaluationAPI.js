import { apiConfig } from './apiConfig.js';

const { apiCall, API_ENDPOINTS } = apiConfig;

/**
 * Função para buscar todas as avaliações.
 * 
 * @async
 * @function getAllEvaluations
 * @returns {Promise<Array>} Lista de avaliações.
 */
const getAllEvaluations = async () => {
  return apiCall(API_ENDPOINTS.evaluations.all, { method: 'GET' });
};

/**
 * Função para buscar uma avaliação específica pelo ID.
 * 
 * @async
 * @function getEvaluationById
 * @param {string|number} evaluationId - O ID da avaliação.
 * @returns {Promise<Object>} A avaliação com o ID fornecido.
 */
const getEvaluationById = async (evaluationId) => {
  return apiCall(API_ENDPOINTS.evaluations.byId(evaluationId), { method: 'GET' });
};

/**
 * Função para buscar todas as avaliações de um vendedor específico.
 * 
 * @async
 * @function getEvaluationsForSeller
 * @param {string|number} sellerId - O ID do vendedor.
 * @returns {Promise<Array>} Lista de avaliações para o vendedor.
 */
const getEvaluationsForSeller = async (sellerId) => {
  return apiCall(API_ENDPOINTS.evaluations.byEvaluated(sellerId), { method: 'GET' });
};

/**
 * Função para buscar a média das avaliações de um usuário.
 * 
 * @async
 * @function getAverageRating
 * @param {string|number} userId - O ID do usuário.
 * @returns {Promise<Object>} A média das avaliações do usuário.
 */
const getAverageRating = async (userId) => {
  return apiCall(API_ENDPOINTS.evaluations.averageRating(userId), { method: 'GET' });
};

/**
 * Função para criar uma nova avaliação.
 * 
 * @async
 * @function addEvaluation
 * @param {Object} evaluationData - Dados da avaliação a ser criada.
 * @returns {Promise<Object>} A avaliação criada.
 */
const addEvaluation = async (evaluationData) => {
  return apiCall(API_ENDPOINTS.evaluations.create, {
    method: 'POST',
    body: JSON.stringify(evaluationData),
  });
};

/**
 * Função para atualizar uma avaliação existente.
 * 
 * @async
 * @function updateEvaluation
 * @param {Object} evaluationData - Dados atualizados da avaliação.
 * @returns {Promise<Object>} A avaliação atualizada.
 */
const updateEvaluation = async (id, evaluationData) => {
  return apiCall(API_ENDPOINTS.evaluations.update(id), {
    method: 'PUT',
    body: JSON.stringify(evaluationData),
  });
};


/**
 * Função para excluir uma avaliação.
 * 
 * @async
 * @function deleteEvaluation
 * @param {string|number} evaluationId - O ID da avaliação a ser excluída.
 * @returns {Promise<Object>} A confirmação da exclusão da avaliação.
 */
const deleteEvaluation = async (evaluationId) => {
  return apiCall(API_ENDPOINTS.evaluations.delete(evaluationId), { method: 'DELETE' });
};

/**
 * Função para verificar se o comprador já avaliou o vendedor para um produto.
 * 
 * @async
 * @function hasEvaluated
 * @param {string|number} buyerId - O ID do comprador.
 * @param {string|number} sellerId - O ID do vendedor.
 * @param {string|number} productId - O ID do produto.
 * @returns {Promise<Object>} A resposta indicando se o comprador avaliou o vendedor para o produto.
 */
const hasEvaluated = async (buyerId, sellerId, productId) => {
  return apiCall(API_ENDPOINTS.evaluations.hasEvaluated(buyerId, sellerId, productId), { method: 'GET' });
};

/**
 * Função para contar o número total de avaliações.
 * 
 * @async
 * @function countEvaluations
 * @returns {Promise<Object>} O total de avaliações.
 */
const countEvaluations = async () => {
  return apiCall(API_ENDPOINTS.evaluations.count, { method: 'GET' });
};

/**
 * Função para contar o número de avaliações de um usuário específico.
 * 
 * @async
 * @function countEvaluationsByUser
 * @param {string|number} userId - O ID do usuário.
 * @returns {Promise<Object>} O número de avaliações do usuário.
 */
const countEvaluationsByUser = async (userId) => {
  return apiCall(API_ENDPOINTS.evaluations.countByEvaluated(userId), { method: 'GET' });
};

/**
 * Função para verificar quais usuários são elegíveis para avaliar.
 * 
 * @async
 * @function checkEligibility
 * @param {string|number} userId - O ID do usuário.
 * @returns {Promise<Object>} A lista de usuários elegíveis para avaliação.
 */
const checkEligibility = async (userId) => {
  try {
    const result = await apiCall(API_ENDPOINTS.evaluations.eligible(userId), { method: 'GET' });
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Erro ao verificar produtos elegíveis para avaliação:', error);
    return [];
  }
};

export const evaluationAPI = {
  getAllEvaluations,
  getEvaluationById,
  getEvaluationsForSeller,
  getAverageRating,
  addEvaluation,
  updateEvaluation,
  deleteEvaluation,
  hasEvaluated,
  countEvaluations,
  countEvaluationsByUser,
  checkEligibility,
};
