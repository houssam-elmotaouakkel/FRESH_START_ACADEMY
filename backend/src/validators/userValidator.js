const { z } = require('zod');

/**
 * User roles from Prisma schema
 */
const ROLES = ['ADMIN', 'TEACHER', 'STUDENT'];

/**
 * Validation schema for admin user update
 */
const updateUserSchema = {
  body: z.object({
    email: z.string().email('Email invalide').toLowerCase().trim().optional(),
    firstName: z
      .string()
      .min(2, 'Prenom trop court')
      .max(50, 'Prenom trop long')
      .trim()
      .optional(),
    lastName: z
      .string()
      .min(2, 'Nom trop court')
      .max(50, 'Nom trop long')
      .trim()
      .optional(),
    phone: z.string().nullable().optional(),
    role: z.enum(ROLES, { message: 'Role invalide' }).optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID invalide'),
  }),
};

/**
 * Validation schema for profile update
 */
const updateProfileSchema = {
  body: z.object({
    firstName: z
      .string()
      .min(2, 'Prenom trop court')
      .max(50, 'Prenom trop long')
      .trim()
      .optional(),
    lastName: z
      .string()
      .min(2, 'Nom trop court')
      .max(50, 'Nom trop long')
      .trim()
      .optional(),
    phone: z.string().nullable().optional(),
  }),
};

/**
 * Validation schema for UUID path params
 */
const userIdSchema = {
  params: z.object({
    id: z.string().uuid('ID invalide'),
  }),
};

/**
 * Validation schema for user list query params
 */
const listUsersSchema = {
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default('1').optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).default('10').optional(),
    search: z.string().trim().optional(),
    role: z.enum(ROLES).optional(),
    isActive: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional(),
    sortBy: z
      .enum(['createdAt', 'email', 'firstName', 'lastName'])
      .default('createdAt')
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
  }),
};

module.exports = {
  updateUserSchema,
  updateProfileSchema,
  userIdSchema,
  listUsersSchema,
};
