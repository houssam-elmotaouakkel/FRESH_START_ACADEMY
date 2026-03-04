const express = require('express');
const router = express.Router();
const { validate, authLimiter } = require('../middlewares');
const { z } = require('zod');
const { successResponse } = require('../utils/apiResponse');
const { requestPasswordReset, resetPassword } = require('../services/passwordResetService');

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token requis'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  }),
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  async (req, res, next) => {
    try {
      await requestPasswordReset(req.body.email);
      // Always return success (don't leak user existence)
      successResponse(res, null, 'Si cet email existe, un lien de réinitialisation a été envoyé');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const { token, password } = req.body;
      await resetPassword(token, password);
      successResponse(res, null, 'Mot de passe réinitialisé avec succès');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
