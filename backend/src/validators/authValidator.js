const { z } = require('zod');

/**
 * Schéma de validation pour l'inscription
 */
const registerSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'Email requis' })
      .email('Email invalide')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Mot de passe requis' })
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    firstName: z
      .string({ required_error: 'Prénom requis' })
      .min(2, 'Prénom trop court')
      .max(50, 'Prénom trop long')
      .trim(),
    lastName: z
      .string({ required_error: 'Nom requis' })
      .min(2, 'Nom trop court')
      .max(50, 'Nom trop long')
      .trim(),
    phone: z
      .string()
      .optional()
      .nullable(),
  }),
};

/**
 * Schéma de validation pour la connexion
 */
const loginSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'Email requis' })
      .email('Email invalide')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Mot de passe requis' })
      .min(1, 'Mot de passe requis'),
  }),
};

/**
 * Schéma de validation pour le refresh token
 */
const refreshTokenSchema = {
  body: z.object({
    refreshToken: z
      .string({ required_error: 'Refresh token requis' })
      .min(1, 'Refresh token requis'),
  }),
};

/**
 * Schéma de validation pour le changement de mot de passe
 */
const changePasswordSchema = {
  body: z.object({
    currentPassword: z
      .string({ required_error: 'Mot de passe actuel requis' })
      .min(1, 'Mot de passe actuel requis'),
    newPassword: z
      .string({ required_error: 'Nouveau mot de passe requis' })
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
      .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
      .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
};