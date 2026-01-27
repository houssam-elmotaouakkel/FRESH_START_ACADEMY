const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, authenticate, authLimiter } = require('../middlewares');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} = require('../validators/authValidator');

/**
 * @route   POST /api/auth/register
 * @desc    Inscription
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Rafraîchir le token
 * @access  Public
 */
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/auth/logout-all
 * @desc    Déconnexion de tous les appareils
 * @access  Private
 */
router.post('/logout-all', authenticate, authController.logoutAll);

/**
 * @route   POST /api/auth/change-password
 * @desc    Changer le mot de passe
 * @access  Private
 */
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

/**
 * @route   GET /api/auth/me
 * @desc    Profil utilisateur connecté
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

module.exports = router;