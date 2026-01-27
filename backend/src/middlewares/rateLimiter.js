const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Rate limiter général pour l'API
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests,   // 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter strict pour l'authentification
 * Protection contre les attaques bruteforce
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 tentatives
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter pour le formulaire de contact
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,                    // 5 messages par heure
  message: {
    success: false,
    message: 'Trop de messages envoyés, réessayez plus tard',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  contactLimiter,
};