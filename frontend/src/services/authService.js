import api from './api';

const authService = {
  // Inscription
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  // Connexion
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  // Déconnexion
  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response;
  },

  // Déconnexion de tous les appareils
  logoutAll: async () => {
    const response = await api.post('/auth/logout-all');
    return response;
  },

  // Rafraîchir le token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response;
  },

  // Récupérer le profil
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  // Changer le mot de passe
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  },

  // Demander la réinitialisation du mot de passe
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // Réinitialiser le mot de passe avec un token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response;
  },
};

export default authService;