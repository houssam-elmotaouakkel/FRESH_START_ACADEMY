const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate, authenticate, authorize } = require('../middlewares');
const {
  updateUserSchema,
  updateProfileSchema,
  userIdSchema,
  listUsersSchema,
} = require('../validators/userValidator');

// ============================================
// Routes Profil (User connecté)
// ============================================

/**
 * @route   GET /api/users/profile
 * @desc    Récupérer mon profil
 * @access  Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Mettre à jour mon profil
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  validate(updateProfileSchema),
  userController.updateProfile
);

// ============================================
// Routes Admin (CRUD Users)
// ============================================

/**
 * @route   GET /api/users
 * @desc    Liste tous les utilisateurs
 * @access  Admin
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(listUsersSchema),
  userController.getAllUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Récupérer un utilisateur
 * @access  Admin
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(userIdSchema),
  userController.getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Modifier un utilisateur
 * @access  Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateUserSchema),
  userController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Supprimer un utilisateur
 * @access  Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(userIdSchema),
  userController.deleteUser
);

module.exports = router;