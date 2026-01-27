const logger = require('../utils/logger');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Classe d'erreur personnalisée pour l'API
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware pour les routes non trouvées (404)
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} non trouvée`));
};

/**
 * Middleware de gestion globale des erreurs
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';
  let errors = err.errors || null;

  // Erreurs Prisma
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Un enregistrement avec ces données existe déjà';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Enregistrement non trouvé';
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré';
  }

  // Erreurs de validation Zod
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Données invalides';
    errors = err.errors ? err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    })) : err.issues ? err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    })) : null;
  }

  // Log de l'erreur
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`);
  
  if (err.stack && process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }

  // En production, ne pas exposer les détails des erreurs 500
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Une erreur interne est survenue';
    errors = null;
  }

  return errorResponse(res, message, statusCode, errors);
};

module.exports = {
  ApiError,
  notFound,
  errorHandler,
};