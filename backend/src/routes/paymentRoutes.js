const express = require('express');
const router = express.Router();
const { authenticate, PERMISSIONS, requirePermission, auditMiddleware, validate } = require('../middlewares');
const { z } = require('zod');
const { successResponse, createdResponse } = require('../utils/apiResponse');
const paymentService = require('../services/paymentService');

const createPaymentSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('ID de cours invalide'),
  }),
});

const confirmPaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de paiement invalide'),
  }),
});

/**
 * @route   POST /api/payments
 * @desc    Create a payment intent
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validate(createPaymentSchema),
  async (req, res, next) => {
    try {
      const result = await paymentService.createPayment({
        userId: req.user.id,
        courseId: req.body.courseId,
      });
      createdResponse(res, result, 'Paiement initié');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/payments/:id/confirm
 * @desc    Confirm a payment
 * @access  Private
 */
router.post(
  '/:id/confirm',
  authenticate,
  validate(confirmPaymentSchema),
  auditMiddleware('CONFIRM', 'PAYMENT'),
  async (req, res, next) => {
    try {
      const result = await paymentService.confirmPayment(req.params.id, req.user.id);
      successResponse(res, result, 'Paiement confirmé');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/payments/my
 * @desc    Get my payments
 * @access  Private
 */
router.get('/my', authenticate, async (req, res, next) => {
  try {
    const payments = await paymentService.getUserPayments(req.user.id);
    successResponse(res, payments, 'Mes paiements');
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/payments
 * @desc    Get all payments (admin)
 * @access  Admin
 */
router.get(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.METRICS_VIEW),
  async (req, res, next) => {
    try {
      const { page, limit, status } = req.query;
      const result = await paymentService.getAllPayments({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
      });
      successResponse(res, result, 'Paiements récupérés');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
