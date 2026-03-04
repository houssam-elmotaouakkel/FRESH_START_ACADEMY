const express = require('express');
const router = express.Router();
const { authenticate, validate } = require('../middlewares');
const { z } = require('zod');
const { successResponse } = require('../utils/apiResponse');
const totpService = require('../services/totpService');

const totpCodeSchema = z.object({
  body: z.object({
    code: z.string().length(6, 'Le code TOTP doit contenir 6 chiffres'),
  }),
});

/**
 * @route   POST /api/auth/2fa/setup
 * @desc    Generate TOTP secret + QR code
 * @access  Private
 */
router.post('/setup', authenticate, async (req, res, next) => {
  try {
    const result = await totpService.setupTotp(req.user.id);
    successResponse(res, result, 'Scannez le QR code avec votre application d\'authentification');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Verify code and enable 2FA
 * @access  Private
 */
router.post(
  '/enable',
  authenticate,
  validate(totpCodeSchema),
  async (req, res, next) => {
    try {
      await totpService.enableTotp(req.user.id, req.body.code);
      successResponse(res, null, '2FA activé avec succès');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable 2FA with code verification
 * @access  Private
 */
router.post(
  '/disable',
  authenticate,
  validate(totpCodeSchema),
  async (req, res, next) => {
    try {
      await totpService.disableTotp(req.user.id, req.body.code);
      successResponse(res, null, '2FA désactivé');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
