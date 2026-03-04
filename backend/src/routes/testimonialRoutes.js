const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { validate, authenticate, PERMISSIONS, requirePermission, auditMiddleware } = require('../middlewares');
const {
  createTestimonialSchema,
  updateTestimonialSchema,
  testimonialIdSchema,
  listTestimonialsSchema,
} = require('../validators/testimonialValidator');

// ============================================
// Routes Publiques
// ============================================

/**
 * @route   GET /api/testimonials
 * @desc    Témoignages approuvés
 * @access  Public
 */
router.get('/', testimonialController.getApprovedTestimonials);

/**
 * @route   GET /api/testimonials/featured
 * @desc    Témoignages en vedette
 * @access  Public
 */
router.get('/featured', testimonialController.getFeaturedTestimonials);

/**
 * @route   POST /api/testimonials
 * @desc    Soumettre un témoignage
 * @access  Public
 */
router.post(
  '/',
  validate(createTestimonialSchema),
  testimonialController.createTestimonial
);

// ============================================
// Routes Admin
// ============================================

/**
 * @route   GET /api/testimonials/admin
 * @desc    Tous les témoignages
 * @access  Admin
 */
router.get(
  '/admin',
  authenticate,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  validate(listTestimonialsSchema),
  testimonialController.getAllTestimonials
);

/**
 * @route   GET /api/testimonials/:id
 * @desc    Détails d'un témoignage
 * @access  Admin
 */
router.get(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  validate(testimonialIdSchema),
  testimonialController.getTestimonialById
);

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Modifier un témoignage
 * @access  Admin
 */
router.put(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  validate(updateTestimonialSchema),
  auditMiddleware('UPDATE', 'TESTIMONIAL'),
  testimonialController.updateTestimonial
);

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Supprimer un témoignage
 * @access  Admin
 */
router.delete(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  validate(testimonialIdSchema),
  auditMiddleware('DELETE', 'TESTIMONIAL'),
  testimonialController.deleteTestimonial
);

/**
 * @route   PUT /api/testimonials/:id/approve
 * @desc    Approuver/Désapprouver
 * @access  Admin
 */
router.put(
  '/:id/approve',
  authenticate,
  requirePermission(PERMISSIONS.TESTIMONIALS_APPROVE),
  validate(testimonialIdSchema),
  auditMiddleware('APPROVE', 'TESTIMONIAL'),
  testimonialController.toggleApproval
);

/**
 * @route   PUT /api/testimonials/:id/feature
 * @desc    Mettre en vedette/Retirer
 * @access  Admin
 */
router.put(
  '/:id/feature',
  authenticate,
  requirePermission(PERMISSIONS.TESTIMONIALS_MANAGE),
  validate(testimonialIdSchema),
  auditMiddleware('FEATURE', 'TESTIMONIAL'),
  testimonialController.toggleFeatured
);

module.exports = router;