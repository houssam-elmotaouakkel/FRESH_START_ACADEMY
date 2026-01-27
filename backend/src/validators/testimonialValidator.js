const { z } = require('zod');

/**
 * Schéma pour soumettre un témoignage (Public)
 */
const createTestimonialSchema = {
  body: z.object({
    author: z
      .string({ required_error: 'Nom requis' })
      .min(2, 'Nom trop court (min 2 caractères)')
      .max(100, 'Nom trop long (max 100 caractères)')
      .trim(),
    role: z
      .string({ required_error: 'Rôle/Profession requis' })
      .min(2, 'Rôle trop court')
      .max(50, 'Rôle trop long (max 50 caractères)')
      .trim(),
    content: z
      .string({ required_error: 'Témoignage requis' })
      .min(20, 'Témoignage trop court (min 20 caractères)')
      .max(1000, 'Témoignage trop long (max 1000 caractères)')
      .trim(),
    rating: z
      .number()
      .int('La note doit être un nombre entier')
      .min(1, 'Note minimum: 1')
      .max(5, 'Note maximum: 5')
      .default(5)
      .optional(),
    avatar: z
      .string()
      .url('URL avatar invalide')
      .optional()
      .nullable(),
  }),
};

/**
 * Schéma pour modifier un témoignage (Admin)
 */
const updateTestimonialSchema = {
  body: z.object({
    author: z
      .string()
      .min(2)
      .max(100)
      .trim()
      .optional(),
    role: z
      .string()
      .min(2)
      .max(50)
      .trim()
      .optional(),
    content: z
      .string()
      .min(20)
      .max(1000)
      .trim()
      .optional(),
    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional(),
    avatar: z
      .string()
      .url()
      .optional()
      .nullable(),
    isApproved: z
      .boolean()
      .optional(),
    isFeatured: z
      .boolean()
      .optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID témoignage invalide'),
  }),
};

/**
 * Schéma pour les paramètres d'ID
 */
const testimonialIdSchema = {
  params: z.object({
    id: z.string().uuid('ID témoignage invalide'),
  }),
};

/**
 * Schéma pour la liste des témoignages (Admin)
 */
const listTestimonialsSchema = {
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
    isApproved: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    isFeatured: z
      .enum(['true', 'false'])
      .transform(val => val === 'true')
      .optional(),
    sortBy: z
      .enum(['createdAt', 'rating', 'author'])
      .default('createdAt')
      .optional(),
    sortOrder: z
      .enum(['asc', 'desc'])
      .default('desc')
      .optional(),
  }),
};

module.exports = {
  createTestimonialSchema,
  updateTestimonialSchema,
  testimonialIdSchema,
  listTestimonialsSchema,
};