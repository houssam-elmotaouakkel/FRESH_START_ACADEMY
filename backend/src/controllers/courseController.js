const courseService = require('../services/courseService');
const { successResponse, createdResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Liste tous les cours
 * GET /api/courses
 */
const getAllCourses = async (req, res, next) => {
  try {
    const result = await courseService.getAllCourses(req.query);

    paginatedResponse(
      res,
      result.courses,
      result.pagination,
      'Cours récupérés'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un cours par ID
 * GET /api/courses/:id
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);

    successResponse(res, course, 'Cours récupéré');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un cours par slug
 * GET /api/courses/slug/:slug
 */
const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await courseService.getCourseBySlug(req.params.slug);

    successResponse(res, course, 'Cours récupéré');
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau cours (Admin)
 * POST /api/courses
 */
const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body);

    createdResponse(res, course, 'Cours créé avec succès');
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un cours (Admin)
 * PUT /api/courses/:id
 */
const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);

    successResponse(res, course, 'Cours mis à jour');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un cours (Admin)
 * DELETE /api/courses/:id
 */
const deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id);

    successResponse(res, null, 'Cours supprimé');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les catégories avec comptage
 * GET /api/courses/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await courseService.getCategoriesWithCount();

    successResponse(res, categories, 'Catégories récupérées');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
};