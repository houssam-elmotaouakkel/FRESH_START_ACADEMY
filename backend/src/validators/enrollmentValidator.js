const { z } = require('zod');

/**
 * Statuts valides (selon le schéma Prisma)
 */
const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

/**
 * Schéma pour créer une inscription
 */
const createEnrollmentSchema = {
  body: z.object({
    courseId: z
      .string({ required_error: 'ID du cours requis' })
      .uuid('ID du cours invalide'),
    notes: z
      .string()
      .max(500, 'Notes trop longues (max 500 caractères)')
      .optional()
      .nullable(),
  }),
};

/**
 * Schéma pour changer le statut (Admin)
 */
const updateStatusSchema = {
  body: z.object({
    status: z
      .enum(STATUSES, { message: 'Statut invalide' }),
    notes: z
      .string()
      .max(500)
      .optional()
      .nullable(),
  }),
  params: z.object({
    id: z.string().uuid('ID inscription invalide'),
  }),
};

/**
 * Schéma pour les paramètres d'ID
 */
const enrollmentIdSchema = {
  params: z.object({
    id: z.string().uuid('ID inscription invalide'),
  }),
};

/**
 * Schéma pour la liste des inscriptions (Admin)
 */
const listEnrollmentsSchema = {
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
    status: z
      .enum(STATUSES)
      .optional(),
    courseId: z
      .string()
      .uuid()
      .optional(),
    userId: z
      .string()
      .uuid()
      .optional(),
    sortBy: z
      .enum(['enrolledAt', 'status'])
      .default('enrolledAt')
      .optional(),
    sortOrder: z
      .enum(['asc', 'desc'])
      .default('desc')
      .optional(),
  }),
};

module.exports = {
  createEnrollmentSchema,
  updateStatusSchema,
  enrollmentIdSchema,
  listEnrollmentsSchema,
  STATUSES,
};