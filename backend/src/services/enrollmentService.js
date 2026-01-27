const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const { getPagination } = require('../utils/helpers');
const logger = require('../utils/logger');

const prisma = getDbClient();

/**
 * Créer une inscription (User s'inscrit à un cours)
 */
const createEnrollment = async (userId, data) => {
  const { courseId, notes } = data;

  // Vérifier si le cours existe et est actif
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      isActive: true,
      maxStudents: true,
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new ApiError(404, 'Cours non trouvé');
  }

  if (!course.isActive) {
    throw new ApiError(400, 'Ce cours n\'est plus disponible');
  }

  // Vérifier si l'utilisateur est déjà inscrit
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new ApiError(409, 'Vous êtes déjà inscrit à ce cours');
  }

  // Vérifier si le cours n'est pas complet
  if (course.maxStudents && course._count.enrollments >= course.maxStudents) {
    throw new ApiError(400, 'Ce cours est complet');
  }

  // Créer l'inscription
  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
      notes,
      status: 'PENDING',
    },
    select: {
      id: true,
      status: true,
      notes: true,
      enrolledAt: true,
      course: {
        select: {
          id: true,
          title: true,
          category: true,
          level: true,
          price: true,
        },
      },
    },
  });

  logger.info(`User ${userId} enrolled in course ${courseId}`);

  return enrollment;
};

/**
 * Récupérer les inscriptions de l'utilisateur connecté
 */
const getMyEnrollments = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { enrolledAt: 'desc' },
    select: {
      id: true,
      status: true,
      notes: true,
      enrolledAt: true,
      completedAt: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          level: true,
          price: true,
          duration: true,
          image: true,
          startDate: true,
          endDate: true,
          teacher: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  return enrollments;
};

/**
 * Récupérer une inscription par ID
 */
const getEnrollmentById = async (id, userId = null, isAdmin = false) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      status: true,
      notes: true,
      enrolledAt: true,
      completedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          level: true,
          price: true,
          duration: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Inscription non trouvée');
  }

  // Vérifier les permissions (soit admin, soit propriétaire)
  if (!isAdmin && enrollment.userId !== userId) {
    throw new ApiError(403, 'Accès non autorisé');
  }

  return enrollment;
};

/**
 * Annuler son inscription (User)
 */
const cancelMyEnrollment = async (id, userId) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Inscription non trouvée');
  }

  if (enrollment.userId !== userId) {
    throw new ApiError(403, 'Accès non autorisé');
  }

  if (enrollment.status === 'CANCELLED') {
    throw new ApiError(400, 'Cette inscription est déjà annulée');
  }

  if (enrollment.status === 'COMPLETED') {
    throw new ApiError(400, 'Impossible d\'annuler une inscription terminée');
  }

  const updated = await prisma.enrollment.update({
    where: { id },
    data: { status: 'CANCELLED' },
    select: {
      id: true,
      status: true,
      enrolledAt: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  logger.info(`Enrollment ${id} cancelled by user ${userId}`);

  return updated;
};

/**
 * Liste toutes les inscriptions (Admin)
 */
const getAllEnrollments = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    courseId,
    userId,
    sortBy = 'enrolledAt',
    sortOrder = 'desc',
  } = options;

  const { skip, take } = getPagination(page, limit);

  // Construire les filtres
  const where = {};

  if (status) {
    where.status = status;
  }

  if (courseId) {
    where.courseId = courseId;
  }

  if (userId) {
    where.userId = userId;
  }

  // Compter le total
  const total = await prisma.enrollment.count({ where });

  // Récupérer les inscriptions
  const enrollments = await prisma.enrollment.findMany({
    where,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      status: true,
      enrolledAt: true,
      completedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
    },
  });

  return {
    enrollments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Changer le statut d'une inscription (Admin)
 */
const updateEnrollmentStatus = async (id, data) => {
  const { status, notes } = data;

  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Inscription non trouvée');
  }

  const updateData = { status };

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  // Si le statut passe à COMPLETED, ajouter la date
  if (status === 'COMPLETED') {
    updateData.completedAt = new Date();
  }

  const updated = await prisma.enrollment.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      status: true,
      notes: true,
      enrolledAt: true,
      completedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  logger.info(`Enrollment ${id} status updated to ${status}`);

  return updated;
};

/**
 * Supprimer une inscription (Admin)
 */
const deleteEnrollment = async (id) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
  });

  if (!enrollment) {
    throw new ApiError(404, 'Inscription non trouvée');
  }

  await prisma.enrollment.delete({
    where: { id },
  });

  logger.info(`Enrollment ${id} deleted`);
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