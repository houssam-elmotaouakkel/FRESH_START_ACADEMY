import api from './api';

const userService = {
  // Récupérer mon profil
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response;
  },

  // Mettre à jour mon profil
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response;
  },

  // === ADMIN ===

  // Liste des utilisateurs
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response;
  },
  getUsers: async (params = {}) => {
    return userService.getAllUsers(params);
  },

  // Récupérer un utilisateur
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response;
  },

  // Modifier un utilisateur
  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response;
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },
};

export default userService;
