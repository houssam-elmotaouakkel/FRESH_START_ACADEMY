const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { validate, authenticate, authorize } = require('../middlewares');
const {
  createEnrollmentSchema,
  updateStatusSchema,
  enrollmentIdSchema,
  listEnrollmentsSchema,
} = require('../validators/enrollmentValidator');

// ============================================
// Routes User (authentifié)
// ============================================

/**
 * @route   POST /api/enrollments
 * @desc    S'inscrire à un cours
 * @access  Private (User)
 */
router.post(
  '/',
  authenticate,
  validate(createEnrollmentSchema),
  enrollmentController.createEnrollment
);

/**
 * @route   GET /api/enrollments/my
 * @desc    Mes inscriptions
 * @access  Private (User)
 */
router.get('/my', authenticate, enrollmentController.getMyEnrollments);

/**
 * @route   PUT /api/enrollments/:id/cancel
 * @desc    Annuler mon inscription
 * @access  Private (User)
 */
router.put(
  '/:id/cancel',
  authenticate,
  validate(enrollmentIdSchema),
  enrollmentController.cancelMyEnrollment
);

/**
 * @route   GET /api/enrollments/:id
 * @desc    Détails d'une inscription
 * @access  Private (User/Admin)
 */
router.get(
  '/:id',
  authenticate,
  validate(enrollmentIdSchema),
  enrollmentController.getEnrollmentById
);

// ============================================
// Routes Admin
// ============================================

/**
 * @route   GET /api/enrollments
 * @desc    Liste toutes les inscriptions
 * @access  Admin
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(listEnrollmentsSchema),
  enrollmentController.getAllEnrollments
);

/**
 * @route   PUT /api/enrollments/:id/status
 * @desc    Changer le statut
 * @access  Admin
 */
router.put(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(updateStatusSchema),
  enrollmentController.updateEnrollmentStatus
);

/**
 * @route   DELETE /api/enrollments/:id
 * @desc    Supprimer une inscription
 * @access  Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(enrollmentIdSchema),
  enrollmentController.deleteEnrollment
);

module.exports = router;