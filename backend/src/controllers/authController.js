const authService = require('../services/authService');
const { successResponse, createdResponse } = require('../utils/apiResponse');



//Inscription d'un nouvel utilisateur: POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    createdResponse(res, {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }, 'Inscription réussie');
  } catch (error) {
    next(error);
  }
};



// Connexion d'un utilisateur: POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    successResponse(res, {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    }, 'Connexion réussie');
  } catch (error) {
    next(error);
  }
};


// Rafraîchir le token d'accès: POST /api/auth/refresh-token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);

    successResponse(res, {
      accessToken: result.accessToken,
    }, 'Token rafraîchi');
  } catch (error) {
    next(error);
  }
};


// Déconnexion: POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);

    successResponse(res, null, 'Déconnexion réussie');
  } catch (error) {
    next(error);
  }
};


// Déconnexion de tous les appareils (nécessite authentification): POST /api/auth/logout-all
const logoutAll = async (req, res, next) => {
  try {
    await authService.logoutAll(req.user.id);

    successResponse(res, null, 'Déconnexion de tous les appareils réussie');
  } catch (error) {
    next(error);
  }
};


// Changer le mot de passe (nécessite authentification): POST /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    successResponse(res, null, 'Mot de passe modifié avec succès');
  } catch (error) {
    next(error);
  }
};


// Récupérer le profil de l'utilisateur connecté: GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    successResponse(res, req.user, 'Profil récupéré');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  changePassword,
  getMe,
};