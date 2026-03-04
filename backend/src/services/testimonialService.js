const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const { getPagination } = require('../utils/helpers');
const logger = require('../utils/logger');

const prisma = getDbClient();

/**
 * Récupérer les témoignages approuvés (Public)
 */
const getApprovedTestimonials = async (limit = 10) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      author: true,
      role: true,
      content: true,
      rating: true,
      avatar: true,
      createdAt: true,
    },
  });

  return testimonials;
};

/**
 * Récupérer les témoignages en vedette (Public)
 */
const getFeaturedTestimonials = async (limit = 6) => {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      isApproved: true,
      isFeatured: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      author: true,
      role: true,
      content: true,
      rating: true,
      avatar: true,
    },
  });

  return testimonials;
};

/**
 * Soumettre un témoignage (Public)
 */
const createTestimonial = async (data) => {
  const testimonial = await prisma.testimonial.create({
    data: {
      author: data.author,
      role: data.role,
      content: data.content,
      rating: data.rating || 5,
      avatar: data.avatar || null,
      isApproved: false, // Nécessite approbation admin
      isFeatured: false,
    },
    select: {
      id: true,
      author: true,
      role: true,
      content: true,
      rating: true,
      createdAt: true,
    },
  });

  logger.info(`New testimonial submitted by: ${data.author}`);

  return testimonial;
};

/**
 * Récupérer tous les témoignages (Admin)
 */
const getAllTestimonials = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    isApproved,
    isFeatured,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const { skip, take } = getPagination(page, limit);

  // Construire les filtres
  const where = {};

  if (typeof isApproved === 'boolean') {
    where.isApproved = isApproved;
  }

  if (typeof isFeatured === 'boolean') {
    where.isFeatured = isFeatured;
  }

  // Parallel queries for performance
  const [total, pendingCount, testimonials] = await Promise.all([
    prisma.testimonial.count({ where }),
    prisma.testimonial.count({ where: { isApproved: false } }),
    prisma.testimonial.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
    }),
  ]);

  return {
    testimonials,
    pendingCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Récupérer un témoignage par ID (Admin)
 */
const getTestimonialById = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw new ApiError(404, 'Témoignage non trouvé');
  }

  return testimonial;
};

/**
 * Modifier un témoignage (Admin)
 */
const updateTestimonial = async (id, data) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw new ApiError(404, 'Témoignage non trouvé');
  }

  // Whitelist allowed fields to prevent mass-assignment
  const allowedFields = ['author', 'role', 'content', 'rating', 'avatar', 'isApproved', 'isFeatured'];
  const filteredData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: filteredData,
  });

  logger.info(`Testimonial ${id} updated`);

  return updated;
};

/**
 * Supprimer un témoignage (Admin)
 */
const deleteTestimonial = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw new ApiError(404, 'Témoignage non trouvé');
  }

  await prisma.testimonial.delete({
    where: { id },
  });

  logger.info(`Testimonial ${id} deleted`);
};

/**
 * Approuver/Désapprouver un témoignage (Admin)
 */
const toggleApproval = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw new ApiError(404, 'Témoignage non trouvé');
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: { isApproved: !testimonial.isApproved },
    select: {
      id: true,
      author: true,
      isApproved: true,
    },
  });

  logger.info(`Testimonial ${id} approval toggled to ${updated.isApproved}`);

  return updated;
};

/**
 * Mettre en vedette/Retirer de la vedette (Admin)
 */
const toggleFeatured = async (id) => {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    throw new ApiError(404, 'Témoignage non trouvé');
  }

  // Ne peut être en vedette que si approuvé
  if (!testimonial.isApproved && !testimonial.isFeatured) {
    throw new ApiError(400, 'Le témoignage doit être approuvé avant d\'être mis en vedette');
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: { isFeatured: !testimonial.isFeatured },
    select: {
      id: true,
      author: true,
      isFeatured: true,
    },
  });

  logger.info(`Testimonial ${id} featured toggled to ${updated.isFeatured}`);

  return updated;
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