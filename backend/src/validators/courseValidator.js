const { z } = require('zod');

/**
 * Catégories et niveaux valides (selon le schéma Prisma)
 */
const CATEGORIES = ['LANGUAGES', 'SUPPORT', 'TRAINING', 'SOFT_SKILLS'];
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

/**
 * Schéma de validation pour la création d'un cours
 */
const createCourseSchema = {
  body: z.object({
    title: z
      .string({ required_error: 'Titre requis' })
      .min(3, 'Titre trop court (min 3 caractères)')
      .max(255, 'Titre trop long (max 255 caractères)')
      .trim(),
    description: z
      .string({ required_error: 'Description requise' })
      .min(10, 'Description trop courte (min 10 caractères)')
      .trim(),
    content: z
      .string()
      .optional()
      .nullable(),
    category: z
      .enum(CATEGORIES, { message: 'Catégorie invalide' }),
    level: z
      .enum(LEVELS, { message: 'Niveau invalide' })
      .default('BEGINNER')
      .optional(),
    price: z
      .number({ required_error: 'Prix requis' })
      .min(0, 'Le prix ne peut pas être négatif'),
    duration: z
      .number({ required_error: 'Durée requise' })
      .int('La durée doit être un nombre entier')
      .min(1, 'La durée minimum est 1 heure'),
    maxStudents: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .optional(),
    image: z
      .string()
      .url('URL image invalide')
      .optional()
      .nullable(),
    isOnline: z
      .boolean()
      .default(true)
      .optional(),
    isActive: z
      .boolean()
      .default(true)
      .optional(),
    startDate: z
      .string()
      .datetime({ message: 'Date de début invalide' })
      .optional()
      .nullable(),
    endDate: z
      .string()
      .datetime({ message: 'Date de fin invalide' })
      .optional()
      .nullable(),
    teacherId: z
      .string()
      .uuid('ID enseignant invalide')
      .optional()
      .nullable(),
  }),
};

/**
 * Schéma de validation pour la mise à jour d'un cours
 */
const updateCourseSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'Titre trop court')
      .max(255, 'Titre trop long')
      .trim()
      .optional(),
    description: z
      .string()
      .min(10, 'Description trop courte')
      .trim()
      .optional(),
    content: z
      .string()
      .optional()
      .nullable(),
    category: z
      .enum(CATEGORIES, { message: 'Catégorie invalide' })
      .optional(),
    level: z
      .enum(LEVELS, { message: 'Niveau invalide' })
      .optional(),
    price: z
      .number()
      .min(0, 'Le prix ne peut pas être négatif')
      .optional(),
    duration: z
      .number()
      .int()
      .min(1)
      .optional(),
    maxStudents: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional(),
    image: z
      .string()
      .url('URL image invalide')
      .optional()
      .nullable(),
    isOnline: z
      .boolean()
      .optional(),
    isActive: z
      .boolean()
      .optional(),
    startDate: z
      .string()
      .datetime()
      .optional()
      .nullable(),
    endDate: z
      .string()
      .datetime()
      .optional()
      .nullable(),
    teacherId: z
      .string()
      .uuid()
      .optional()
      .nullable(),
  }),
  params: z.object({
    id: z.string().uuid('ID cours invalide'),
  }),
};

/**
 * Schéma de validation pour les paramètres d'ID
 */
const courseIdSchema = {
  params: z.object({
    id: z.string().uuid('ID cours invalide'),
  }),
};

/**
 * Schéma de validation pour le slug
 */
const courseSlugSchema = {
  params: z.object({
    slug: z
      .string()
      .min(1, 'Slug requis')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide'),
  }),
};

/**
 * Schéma de validation pour la liste des cours
 */
const listCoursesSchema = {
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .default('1')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .default('10')
      .optional(),
    search: z
      .string()
      .trim()
      .optional(),
    category: z
      .enum(CATEGORIES)
      .optional(),
    level: z
      .enum(LEVELS)
      .optional(),
    isOnline: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    isActive: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    minPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .transform(Number)
      .optional(),
    maxPrice: z
      .string()
      .regex(/^\d+(\.\d+)?$/)
      .transform(Number)
      .optional(),
    sortBy: z
      .enum(['createdAt', 'title', 'price', 'duration', 'startDate'])
      .default('createdAt')
      .optional(),
    sortOrder: z
      .enum(['asc', 'desc'])
      .default('desc')
      .optional(),
  }),
};

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  courseIdSchema,
  courseSlugSchema,
  listCoursesSchema,
  CATEGORIES,
  LEVELS,
};