import api from './api';

const contactService = {
  // Envoyer un message (public)
  sendMessage: async (data) => {
    const response = await api.post('/contacts', data);
    return response;
  },

  // === ADMIN ===

  // Liste des messages
  getAllContacts: async (params = {}) => {
    const response = await api.get('/contacts', { params });
    return response;
  },

  // Statistiques
  getStats: async () => {
    const response = await api.get('/contacts/stats');
    return response;
  },

  // Détail d'un message
  getContactById: async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response;
  },

  // Changer le statut
  updateStatus: async (id, status) => {
    const response = await api.put(`/contacts/${id}/status`, { status });
    return response;
  },

  // Supprimer un message
  deleteContact: async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response;
  },
};

export default contactService;