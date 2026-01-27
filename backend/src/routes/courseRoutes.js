const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { validate, authenticate, authorize, optionalAuth } = require('../middlewares');
const {
  createCourseSchema,
  updateCourseSchema,
  courseIdSchema,
  courseSlugSchema,
  listCoursesSchema,
} = require('../validators/courseValidator');

// ============================================
// Routes Publiques
// ============================================

/**
 * @route   GET /api/courses
 * @desc    Liste tous les cours
 * @access  Public
 */
router.get(
  '/',
  validate(listCoursesSchema),
  courseController.getAllCourses
);

/**
 * @route   GET /api/courses/categories
 * @desc    Liste des catégories avec comptage
 * @access  Public
 */
router.get('/categories', courseController.getCategories);

/**
 * @route   GET /api/courses/slug/:slug
 * @desc    Récupérer un cours par slug
 * @access  Public
 */
router.get(
  '/slug/:slug',
  validate(courseSlugSchema),
  courseController.getCourseBySlug
);

/**
 * @route   GET /api/courses/:id
 * @desc    Récupérer un cours par ID
 * @access  Public
 */
router.get(
  '/:id',
  validate(courseIdSchema),
  courseController.getCourseById
);

// ============================================
// Routes Admin
// ============================================

/**
 * @route   POST /api/courses
 * @desc    Créer un cours
 * @access  Admin
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCourseSchema),
  courseController.createCourse
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Modifier un cours
 * @access  Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateCourseSchema),
  courseController.updateCourse
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Supprimer un cours
 * @access  Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(courseIdSchema),
  courseController.deleteCourse
);

module.exports = router;