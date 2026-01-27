const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const { excludeFields, getPagination } = require('../utils/helpers');
const logger = require('../utils/logger');

const prisma = getDbClient();

/**
 * Récupérer tous les utilisateurs avec pagination et filtres
 */
const getAllUsers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const { skip, take } = getPagination(page, limit);

  // Construire les filtres
  const where = {};

  if (search) {
    where.OR = [
      { email: { contains: search } },
      { firstName: { contains: search } },
      { lastName: { contains: search } },
    ];
  }

  if (role) {
    where.role = role;
  }

  if (typeof isActive === 'boolean') {
    where.isActive = isActive;
  }

  // Compter le total
  const total = await prisma.user.count({ where });

  // Récupérer les utilisateurs
  const users = await prisma.user.findMany({
    where,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { enrollments: true },
      },
    },
  });

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Récupérer un utilisateur par ID
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
      enrollments: {
        select: {
          id: true,
          status: true,
          enrolledAt: true,
          course: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
          teacherCourses: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'Utilisateur non trouvé');
  }

  return user;
};

/**
 * Mettre à jour un utilisateur (Admin)
 */
const updateUser = async (id, data) => {
  // Vérifier si l'utilisateur existe
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new ApiError(404, 'Utilisateur non trouvé');
  }

  // Si l'email change, vérifier qu'il n'est pas déjà utilisé
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (emailExists) {
      throw new ApiError(409, 'Cet email est déjà utilisé');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  logger.info(`User updated: ${id}`);

  return updatedUser;
};

/**
 * Supprimer un utilisateur
 */
const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(404, 'Utilisateur non trouvé');
  }

  // Supprimer l'utilisateur (les relations seront supprimées en cascade)
  await prisma.user.delete({
    where: { id },
  });

  logger.info(`User deleted: ${id}`);
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      enrollments: {
        select: {
          id: true,
          status: true,
          enrolledAt: true,
          course: {
            select: {
              id: true,
              title: true,
              category: true,
              level: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
        take: 5,
      },
      _count: {
        select: {
          enrollments: true,
          teacherCourses: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'Utilisateur non trouvé');
  }

  return user;
};

/**
 * Mettre à jour le profil de l'utilisateur connecté
 */
const updateProfile = async (userId, data) => {
  // L'utilisateur ne peut modifier que certains champs
  const allowedFields = ['firstName', 'lastName', 'phone'];
  const filteredData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: filteredData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      updatedAt: true,
    },
  });

  logger.info(`Profile updated: ${userId}`);

  return updatedUser;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
