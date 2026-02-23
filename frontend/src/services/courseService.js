import api from './api';

const courseService = {
  // Liste des cours (public)
  getAllCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response;
  },
  getCourses: async (params = {}) => {
    return courseService.getAllCourses(params);
  },

  // Détail d'un cours par ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response;
  },

  // Détail d'un cours par slug
  getCourseBySlug: async (slug) => {
    const response = await api.get(`/courses/slug/${slug}`);
    return response;
  },

  // Liste des catégories
  getCategories: async () => {
    const response = await api.get('/courses/categories');
    return response;
  },

  // === ADMIN ===

  // Créer un cours
  createCourse: async (data) => {
    const response = await api.post('/courses', data);
    return response;
  },

  // Modifier un cours
  updateCourse: async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);
    return response;
  },

  // Supprimer un cours
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response;
  },
};

export default courseService;
