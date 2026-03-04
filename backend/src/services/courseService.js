const { getDbClient } = require('../config/database');
const { ApiError } = require('../middlewares/errorHandler');
const { generateSlug, getPagination } = require('../utils/helpers');
const logger = require('../utils/logger');

const prisma = getDbClient();

/**
 * Récupérer tous les cours avec pagination et filtres
 */
const getAllCourses = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    level,
    isOnline,
    isActive,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const { skip, take } = getPagination(page, limit);

  // Construire les filtres
  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (category) {
    where.category = category;
  }

  if (level) {
    where.level = level;
  }

  if (typeof isOnline === 'boolean') {
    where.isOnline = isOnline;
  }

  if (typeof isActive === 'boolean') {
    where.isActive = isActive;
  }

  // Filtre de prix
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Parallel queries for performance
  const [total, courses] = await Promise.all([
    prisma.course.count({ where }),
    prisma.course.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        level: true,
        price: true,
        duration: true,
        maxStudents: true,
        image: true,
        isOnline: true,
        isActive: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    }),
  ]);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Récupérer un cours par ID
 */
const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      category: true,
      level: true,
      price: true,
      duration: true,
      maxStudents: true,
      image: true,
      isOnline: true,
      isActive: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new ApiError(404, 'Cours non trouvé');
  }

  return course;
};

/**
 * Récupérer un cours par slug
 */
const getCourseBySlug = async (slug) => {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      category: true,
      level: true,
      price: true,
      duration: true,
      maxStudents: true,
      image: true,
      isOnline: true,
      isActive: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      teacher: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new ApiError(404, 'Cours non trouvé');
  }

  return course;
};

/**
 * Créer un nouveau cours
 */
const createCourse = async (data) => {
  // Générer le slug
  let slug = generateSlug(data.title);

  // Vérifier si le slug existe déjà
  const existingSlug = await prisma.course.findUnique({
    where: { slug },
  });

  if (existingSlug) {
    // Ajouter un suffixe unique
    slug = `${slug}-${Date.now()}`;
  }

  // Whitelist allowed fields to prevent mass-assignment
  const allowedFields = ['title', 'description', 'content', 'category', 'level', 'price', 'duration', 'maxStudents', 'image', 'isOnline', 'isActive', 'teacherId'];
  const filteredData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }
  }

  const course = await prisma.course.create({
    data: {
      ...filteredData,
      slug,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      level: true,
      price: true,
      duration: true,
      maxStudents: true,
      isOnline: true,
      isActive: true,
      startDate: true,
      endDate: true,
      createdAt: true,
    },
  });

  logger.info(`Course created: ${course.title} (${course.id})`);

  return course;
};

/**
 * Mettre à jour un cours
 */
const updateCourse = async (id, data) => {
  // Vérifier si le cours existe
  const existingCourse = await prisma.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new ApiError(404, 'Cours non trouvé');
  }

  // Whitelist allowed fields
  const allowedFields = ['title', 'description', 'content', 'category', 'level', 'price', 'duration', 'maxStudents', 'image', 'isOnline', 'isActive', 'startDate', 'endDate', 'teacherId'];
  let updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  // Si le titre change, régénérer le slug

  if (data.title && data.title !== existingCourse.title) {
    let newSlug = generateSlug(data.title);

    // Vérifier si le nouveau slug existe déjà (sauf pour ce cours)
    const existingSlug = await prisma.course.findFirst({
      where: {
        slug: newSlug,
        NOT: { id },
      },
    });

    if (existingSlug) {
      newSlug = `${newSlug}-${Date.now()}`;
    }

    updateData.slug = newSlug;
  }

  // Convertir les dates si présentes
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  const course = await prisma.course.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      level: true,
      price: true,
      duration: true,
      maxStudents: true,
      isOnline: true,
      isActive: true,
      startDate: true,
      endDate: true,
      updatedAt: true,
    },
  });

  logger.info(`Course updated: ${course.id}`);

  return course;
};

/**
 * Supprimer un cours
 */
const deleteCourse = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    throw new ApiError(404, 'Cours non trouvé');
  }

  await prisma.course.delete({
    where: { id },
  });

  logger.info(`Course deleted: ${id}`);
};

/**
 * Récupérer les catégories avec le nombre de cours
 */
const getCategoriesWithCount = async () => {
  const categories = await prisma.course.groupBy({
    by: ['category'],
    _count: {
      id: true,
    },
    where: {
      isActive: true,
    },
  });

  return categories.map((cat) => ({
    category: cat.category,
    count: cat._count.id,
  }));
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategoriesWithCount,
};