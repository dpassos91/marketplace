import { apiConfig } from './apiConfig.js';

const { apiCall, API_ENDPOINTS } = apiConfig;

/**
 * Função para obter o histórico de mensagens entre o utilizador atual e outro.
 * 
 * @async
 * @function getConversationWith
 * @param {string} otherUsername - O nome do outro utilizador.
 * @returns {Promise<Array>} Lista de mensagens.
 */
const getConversationWith = async (otherUsername) => {
  return apiCall(API_ENDPOINTS.messages.conversationWith(otherUsername), { method: 'GET' });
};

/**
 * Função para marcar como lidas todas as mensagens enviadas por outro utilizador.
 * 
 * @async
 * @function markMessagesAsReadFrom
 * @param {string} senderUsername - Nome do remetente.
 * @returns {Promise<string>} Resposta do backend com número de mensagens lidas.
 */
const markMessagesAsReadFrom = async (senderUsername) => {
  return apiCall(API_ENDPOINTS.messages.readFrom(senderUsername), { method: 'PUT' });
};

/**
 * Função para enviar uma nova mensagem via REST (caso seja necessário).
 * 
 * @async
 * @function sendMessage
 * @param {Object} messageData - Objeto contendo sender, receiver e content.
 * @returns {Promise<Object>} Resposta do backend.
 */
const sendMessage = async (messageData) => {
  return apiCall(API_ENDPOINTS.messages.send, {
    method: 'POST',
    body: JSON.stringify(messageData),
  });
};

export const messagesAPI = {
  getConversationWith,
  markMessagesAsReadFrom,
  sendMessage,
};
