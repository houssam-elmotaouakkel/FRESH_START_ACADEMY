const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { validate, authenticate, optionalAuth, PERMISSIONS, requirePermission, auditMiddleware } = require('../middlewares');
const {
  createCourseSchema,
  updateCourseSchema,
  courseIdSchema,
  courseSlugSchema,
  listCoursesSchema,
} = require('../validators/courseValidator');
const { cacheMiddleware, invalidatePattern } = require('../services/cacheService');

// Cache invalidation middleware for course writes
const invalidateCourseCache = async (req, res, next) => {
  // After the response is sent, invalidate cache
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      invalidatePattern('courses:*');
      invalidatePattern('public:landing:*');
    }
  });
  next();
};

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
  cacheMiddleware('courses:list', 300),
  validate(listCoursesSchema),
  courseController.getAllCourses
);

/**
 * @route   GET /api/courses/categories
 * @desc    Liste des catégories avec comptage
 * @access  Public
 */
router.get('/categories', cacheMiddleware('courses:categories', 600), courseController.getCategories);

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
  requirePermission(PERMISSIONS.COURSES_CREATE),
  validate(createCourseSchema),
  invalidateCourseCache,
  auditMiddleware('CREATE', 'COURSE'),
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
  requirePermission(PERMISSIONS.COURSES_UPDATE),
  validate(updateCourseSchema),
  invalidateCourseCache,
  auditMiddleware('UPDATE', 'COURSE'),
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
  requirePermission(PERMISSIONS.COURSES_DELETE),
  validate(courseIdSchema),
  invalidateCourseCache,
  auditMiddleware('DELETE', 'COURSE'),
  courseController.deleteCourse
);

module.exports = router;