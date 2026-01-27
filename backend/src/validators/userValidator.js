const { z } = require('zod');

/**
 * Schéma de validation pour la mise à jour d'un utilisateur (Admin)
 */
const updateUserSchema = {
  body: z.object({
    email: z
      .string()
      .email('Email invalide')
      .toLowerCase()
      .trim()
      .optional(),
    firstName: z
      .string()
      .min(2, 'Prénom trop court')
      .max(50, 'Prénom trop long')
      .trim()
      .optional(),
    lastName: z
      .string()
      .min(2, 'Nom trop court')
      .max(50, 'Nom trop long')
      .trim()
      .optional(),
    phone: z
      .string()
      .nullable()
      .optional(),
    role: z
      .enum(['USER', 'ADMIN'], { message: 'Rôle invalide' })
      .optional(),
    isActive: z
      .boolean()
      .optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID invalide'),
  }),
};

/**
 * Schéma de validation pour la mise à jour du profil (User)
 */
const updateProfileSchema = {
  body: z.object({
    firstName: z
      .string()
      .min(2, 'Prénom trop court')
      .max(50, 'Prénom trop long')
      .trim()
      .optional(),
    lastName: z
      .string()
      .min(2, 'Nom trop court')
      .max(50, 'Nom trop long')
      .trim()
      .optional(),
    phone: z
      .string()
      .nullable()
      .optional(),
  }),
};

/**
 * Schéma de validation pour les paramètres d'ID (UUID)
 */
const userIdSchema = {
  params: z.object({
    id: z.string().uuid('ID invalide'),
  }),
};

/**
 * Schéma de validation pour la pagination et filtres
 */
const listUsersSchema = {
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
    role: z
      .enum(['USER', 'ADMIN'])
      .optional(),
    isActive: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    sortBy: z
      .enum(['createdAt', 'email', 'firstName', 'lastName'])
      .default('createdAt')
      .optional(),
    sortOrder: z
      .enum(['asc', 'desc'])
      .default('desc')
      .optional(),
  }),
};

module.exports = {
  updateUserSchema,
  updateProfileSchema,
  userIdSchema,
  listUsersSchema,
};