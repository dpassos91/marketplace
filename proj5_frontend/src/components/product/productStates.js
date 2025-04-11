/**
 * Mapeamento de estados de produto que corresponde ao enum ProductStateId do backend
 * Agora inclui mapeamento bidirecional status <-> ID
 */
export const PRODUCT_STATES = {
  RASCUNHO: {
    id: 1,
    status: 'Rascunho', // Adicionado para mapeamento direto com a BD
    translationKey: 'productStates.draft',
    defaultText: 'Rascunho'
  },
  DISPONIVEL: {
    id: 2,
    status: 'Disponível', // Valor exato como vem da BD
    translationKey: 'productStates.available',
    defaultText: 'Disponível'
  },
  RESERVADO: {
    id: 3,
    status: 'Reservado',
    translationKey: 'productStates.reserved',
    defaultText: 'Reservado'
  },
  COMPRADO: {
    id: 4,
    status: 'Comprado',
    translationKey: 'productStates.purchased',
    defaultText: 'Comprado'
  },
  INATIVO: {
    id: 5,
    status: 'Inativo',
    translationKey: 'productStates.inactive',
    defaultText: 'Inativo'
  },

  // Métodos auxiliares melhorados
  fromId: function(id) {
    return Object.values(this).find(state => state.id === id) || null;
  },

  fromStatus: function(status) { // Novo método essencial!
    if (!status) return null;
    
    const normalizedStatus = status
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

    return Object.values(this).find(state => 
      state.status?.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase() === normalizedStatus
    ) || null;
  },

  isActive: function(stateId) {
    return stateId !== this.INATIVO.id;
  }
};


