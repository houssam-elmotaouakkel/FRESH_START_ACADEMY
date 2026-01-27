
// Fonctions utilitaires


/**
 * Générer un slug à partir d'un texte
 * @param {string} text - Texte à convertir
 * @returns {string} - Slug
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Remplacer les espaces par -
    .replace(/[àáâãäå]/g, 'a')   // Remplacer les accents
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9-]/g, '')  // Supprimer les caractères spéciaux
    .replace(/-+/g, '-')         // Remplacer plusieurs - par un seul
    .replace(/^-|-$/g, '');      // Supprimer - au début et à la fin
};

/**
 * Générer un slug unique avec timestamp
 * @param {string} text - Texte à convertir
 * @returns {string} - Slug unique
 */
const generateUniqueSlug = (text) => {
  const slug = generateSlug(text);
  const timestamp = Date.now().toString(36);
  return `${slug}-${timestamp}`;
};

/**
 * Pagination helper
 * @param {number} page - Page actuelle
 * @param {number} limit - Nombre d'éléments par page
 * @returns {object} - skip et take pour Prisma
 */
const getPagination = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  
  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    page: pageNum,
    limit: limitNum,
  };
};

/**
 * Exclure des champs d'un objet
 * @param {object} obj - Objet source
 * @param {string[]} keys - Clés à exclure
 * @returns {object} - Objet sans les clés exclues
 */
const excludeFields = (obj, keys) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  );
};

/**
 * Formater une date pour l'affichage
 * @param {Date} date - Date à formater
 * @returns {string} - Date formatée
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Vérifier si une valeur est vide
 * @param {*} value - Valeur à vérifier
 * @returns {boolean}
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  getPagination,
  excludeFields,
  formatDate,
  isEmpty,
};
