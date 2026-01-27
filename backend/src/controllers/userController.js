const userService = require('../services/userService');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Liste tous les utilisateurs (Admin)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);

    paginatedResponse(
      res,
      result.users,
      result.pagination,
      'Utilisateurs récupérés'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un utilisateur par ID (Admin)
 * GET /api/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    successResponse(res, user, 'Utilisateur récupéré');
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un utilisateur (Admin)
 * PUT /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);

    successResponse(res, user, 'Utilisateur mis à jour');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un utilisateur (Admin)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);

    successResponse(res, null, 'Utilisateur supprimé');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer mon profil (User)
 * GET /api/users/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);

    successResponse(res, user, 'Profil récupéré');
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour mon profil (User)
 * PUT /api/users/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);

    successResponse(res, user, 'Profil mis à jour');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
