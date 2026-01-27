const jwt = require('jsonwebtoken');
const config = require('../config');
const { getDbClient } = require('../config/database');
const { ApiError } = require('./errorHandler');

const prisma = getDbClient();

/**
 * Middleware d'authentification - Vérifie le token JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token du header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Token d\'authentification requis');
    }

    const token = authHeader.split(' ')[1];

    // Vérifier le token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new ApiError(401, 'Utilisateur non trouvé');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Compte désactivé');
    }

    // Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(error);
    } else {
      next(new ApiError(401, 'Token invalide'));
    }
  }
};

/**
 * Middleware d'autorisation - Vérifie le rôle de l'utilisateur
 * @param  {...string} roles - Rôles autorisés (ADMIN, TEACHER, STUDENT)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Non authentifié'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Accès non autorisé'));
    }

    next();
  };
};

/**
 * Middleware d'authentification optionnel
 * Ne bloque pas si pas de token, mais attache l'utilisateur si présent
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Token invalide, continuer sans utilisateur
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};