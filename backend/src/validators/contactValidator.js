const { z } = require('zod');

/**
 * Statuts valides (selon le schéma Prisma)
 */
const STATUSES = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'];

/**
 * Schéma pour envoyer un message de contact
 */
const createContactSchema = {
  body: z.object({
    name: z
      .string({ required_error: 'Nom requis' })
      .min(2, 'Nom trop court (min 2 caractères)')
      .max(100, 'Nom trop long (max 100 caractères)')
      .trim(),
    email: z
      .string({ required_error: 'Email requis' })
      .email('Email invalide')
      .max(255)
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .max(20, 'Numéro de téléphone trop long')
      .optional()
      .nullable(),
    subject: z
      .string()
      .max(255, 'Sujet trop long (max 255 caractères)')
      .trim()
      .optional()
      .nullable(),
    message: z
      .string({ required_error: 'Message requis' })
      .min(10, 'Message trop court (min 10 caractères)')
      .max(2000, 'Message trop long (max 2000 caractères)')
      .trim(),
  }),
};

/**
 * Schéma pour changer le statut (Admin)
 */
const updateStatusSchema = {
  body: z.object({
    status: z
      .enum(STATUSES, { message: 'Statut invalide' }),
  }),
  params: z.object({
    id: z.string().uuid('ID message invalide'),
  }),
};

/**
 * Schéma pour les paramètres d'ID
 */
const contactIdSchema = {
  params: z.object({
    id: z.string().uuid('ID message invalide'),
  }),
};

/**
 * Schéma pour la liste des messages (Admin)
 */
const listContactsSchema = {
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
    search: z
      .string()
      .trim()
      .optional(),
    sortBy: z
      .enum(['createdAt', 'status', 'name'])
      .default('createdAt')
      .optional(),
    sortOrder: z
      .enum(['asc', 'desc'])
      .default('desc')
      .optional(),
  }),
};

module.exports = {
  createContactSchema,
  updateStatusSchema,
  contactIdSchema,
  listContactsSchema,
  STATUSES,
};