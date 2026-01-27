const enrollmentService = require('../services/enrollmentService');
const { successResponse, createdResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * S'inscrire à un cours (User)
 * POST /api/enrollments
 */
const createEnrollment = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.createEnrollment(
      req.user.id,
      req.body
    );

    createdResponse(res, enrollment, 'Inscription réussie');
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer mes inscriptions (User)
 * GET /api/enrollments/my
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(req.user.id);

    successResponse(res, enrollments, `${enrollments.length} inscription(s) trouvée(s)`);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une inscription par ID
 * GET /api/enrollments/:id
 */
const getEnrollmentById = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const enrollment = await enrollmentService.getEnrollmentById(
      req.params.id,
      req.user.id,
      isAdmin
    );

    successResponse(res, enrollment, 'Inscription récupérée');
  } catch (error) {
    next(error);
  }
};

/**
 * Annuler mon inscription (User)
 * PUT /api/enrollments/:id/cancel
 */
const cancelMyEnrollment = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.cancelMyEnrollment(
      req.params.id,
      req.user.id
    );

    successResponse(res, enrollment, 'Inscription annulée');
  } catch (error) {
    next(error);
  }
};

/**
 * Liste toutes les inscriptions (Admin)
 * GET /api/enrollments
 */
const getAllEnrollments = async (req, res, next) => {
  try {
    const result = await enrollmentService.getAllEnrollments(req.query);

    paginatedResponse(
      res,
      result.enrollments,
      result.pagination,
      'Inscriptions récupérées'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Changer le statut d'une inscription (Admin)
 * PUT /api/enrollments/:id/status
 */
const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.updateEnrollmentStatus(
      req.params.id,
      req.body
    );

    successResponse(res, enrollment, 'Statut mis à jour');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une inscription (Admin)
 * DELETE /api/enrollments/:id
 */
const deleteEnrollment = async (req, res, next) => {
  try {
    await enrollmentService.deleteEnrollment(req.params.id);

    successResponse(res, null, 'Inscription supprimée');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollment,
  getMyEnrollments,
  getEnrollmentById,
  cancelMyEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
};