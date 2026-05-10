const { ApiError } = require('./errorHandler');

/**
 * Middleware de validation avec Zod
 * @param {Object} schema - Schéma Zod { body, params, query }
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Valider le body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Valider les paramètres URL
      if (schema.params) {
        const parsed = schema.params.parse(req.params);
        for (const key of Object.keys(req.params)) delete req.params[key];
        Object.assign(req.params, parsed);
      }

      // Valider les query strings
      if (schema.query) {
        const parsed = schema.query.parse(req.query);
        for (const key of Object.keys(req.query)) delete req.query[key];
        Object.assign(req.query, parsed);
      }

      next();
    } catch (error) {
      // Formater les erreurs Zod (Zod utilise 'issues' pas 'errors')
      const zodErrors = error.errors || error.issues;
      if (zodErrors) {
        const errors = zodErrors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(new ApiError(400, 'Données invalides', errors));
      } else {
        next(error);
      }
    }
  };
};

module.exports = { validate };