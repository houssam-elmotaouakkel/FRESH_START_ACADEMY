const testimonialService = require('../services/testimonialService');
const { successResponse, createdResponse, paginatedResponse } = require('../utils/apiResponse');

/**
 * Récupérer les témoignages approuvés (Public)
 * GET /api/testimonials
 */
const getApprovedTestimonials = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const testimonials = await testimonialService.getApprovedTestimonials(limit);

    successResponse(res, testimonials, `${testimonials.length} témoignage(s)`);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les témoignages en vedette (Public)
 * GET /api/testimonials/featured
 */
const getFeaturedTestimonials = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const testimonials = await testimonialService.getFeaturedTestimonials(limit);

    successResponse(res, testimonials, `${testimonials.length} témoignage(s) en vedette`);
  } catch (error) {
    next(error);
  }
};

/**
 * Soumettre un témoignage (Public)
 * POST /api/testimonials
 */
const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body);

    createdResponse(res, testimonial, 'Témoignage soumis avec succès. Il sera visible après approbation.');
  } catch (error) {
    next(error);
  }
};

/**
 * Liste tous les témoignages (Admin)
 * GET /api/testimonials/admin
 */
const getAllTestimonials = async (req, res, next) => {
  try {
    const result = await testimonialService.getAllTestimonials(req.query);

    paginatedResponse(
      res,
      result.testimonials,
      result.pagination,
      `${result.pagination.total} témoignage(s), ${result.pendingCount} en attente`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer un témoignage par ID (Admin)
 * GET /api/testimonials/:id
 */
const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.getTestimonialById(req.params.id);

    successResponse(res, testimonial, 'Témoignage récupéré');
  } catch (error) {
    next(error);
  }
};

/**
 * Modifier un témoignage (Admin)
 * PUT /api/testimonials/:id
 */
const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.updateTestimonial(
      req.params.id,
      req.body
    );

    successResponse(res, testimonial, 'Témoignage mis à jour');
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un témoignage (Admin)
 * DELETE /api/testimonials/:id
 */
const deleteTestimonial = async (req, res, next) => {
  try {
    await testimonialService.deleteTestimonial(req.params.id);

    successResponse(res, null, 'Témoignage supprimé');
  } catch (error) {
    next(error);
  }
};

/**
 * Approuver/Désapprouver (Admin)
 * PUT /api/testimonials/:id/approve
 */
const toggleApproval = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.toggleApproval(req.params.id);

    const message = testimonial.isApproved ? 'Témoignage approuvé' : 'Approbation retirée';
    successResponse(res, testimonial, message);
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre en vedette/Retirer (Admin)
 * PUT /api/testimonials/:id/feature
 */
const toggleFeatured = async (req, res, next) => {
  try {
    const testimonial = await testimonialService.toggleFeatured(req.params.id);

    const message = testimonial.isFeatured ? 'Mis en vedette' : 'Retiré de la vedette';
    successResponse(res, testimonial, message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovedTestimonials,
  getFeaturedTestimonials,
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  toggleApproval,
  toggleFeatured,
};