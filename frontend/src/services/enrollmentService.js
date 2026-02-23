import api from './api';

const enrollmentService = {
  // S'inscrire à un cours
  enroll: async (courseId, notes = null) => {
    const response = await api.post('/enrollments', { courseId, notes });
    return response;
  },

  // Mes inscriptions
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my');
    return response;
  },

  // Détail d'une inscription
  getEnrollmentById: async (id) => {
    const response = await api.get(`/enrollments/${id}`);
    return response;
  },

  // Annuler mon inscription
  cancelEnrollment: async (id) => {
    const response = await api.put(`/enrollments/${id}/cancel`);
    return response;
  },

  // === ADMIN ===

  // Liste des inscriptions
  getAllEnrollments: async (params = {}) => {
    const response = await api.get('/enrollments', { params });
    return response;
  },

  // Changer le statut
  updateStatus: async (id, status, notes = null) => {
    const response = await api.put(`/enrollments/${id}/status`, { status, notes });
    return response;
  },
  updateEnrollment: async (id, data) => {
    const response = await api.put(`/enrollments/${id}/status`, data);
    return response;
  },

  // Supprimer une inscription
  deleteEnrollment: async (id) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response;
  },
};

export default enrollmentService;
