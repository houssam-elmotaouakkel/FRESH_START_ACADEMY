// Réponses API standardisées

// Réponse de succès
const successResponse = (res, data = null, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Réponse d'erreur
const errorResponse = (res, message = 'Erreur', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Réponse de création (201)
const createdResponse = (res, data, message = 'Créé avec succès') => {
  return successResponse(res, data, message, 201);
};

// Réponse paginée
const paginatedResponse = (res, data, pagination, message = 'Succès') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      totalItems: pagination.total,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1,
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
  createdResponse,
  paginatedResponse,
};
