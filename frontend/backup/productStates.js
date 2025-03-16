'use strict';

/**
 * Product state definitions that match the backend's ProductStateId enum
 */
export const PRODUCT_STATES = {
  RASCUNHO: {
    id: 1,
    description: 'Rascunho',
  },
  DISPONIVEL: {
    id: 2,
    description: 'Disponível',
  },
  RESERVADO: {
    id: 3,
    description: 'Reservado',
  },
  COMPRADO: {
    id: 4,
    description: 'Comprado',
  },
  INATIVO: {
    id: 5,
    description: 'Inativo',
  },

  // Helper methods
  fromId: function (id) {
    for (const key in this) {
      if (typeof this[key] === 'object' && this[key].id === id) {
        return this[key];
      }
    }
    return null;
  },

  fromDescription: function (description) {
    if (!description) return null;

    // Normalize the description by removing accents and uppercase
    const normalizedDesc = description
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

    for (const key in this) {
      if (typeof this[key] === 'object') {
        const stateDesc = this[key].description
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();

        if (stateDesc === normalizedDesc) {
          return this[key];
        }
      }
    }
    return null;
  },

  isActive: function (stateId) {
    return stateId !== this.INATIVO.id;
  },
};
