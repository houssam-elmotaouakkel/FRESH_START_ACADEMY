import api from './api';

const testimonialService = {
  // Témoignages approuvés (public)
  getApproved: async (limit = 10) => {
    const response = await api.get('/testimonials', { params: { limit } });
    return response;
  },

  // Témoignages en vedette (public)
  getFeatured: async (limit = 6) => {
    const response = await api.get('/testimonials/featured', { params: { limit } });
    return response;
  },

  // Soumettre un témoignage (public)
  submit: async (data) => {
    const response = await api.post('/testimonials', data);
    return response;
  },

  // === ADMIN ===

  // Liste des témoignages
  getAllTestimonials: async (params = {}) => {
    const response = await api.get('/testimonials/admin', { params });
    return response;
  },

  // Détail d'un témoignage
  getTestimonialById: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response;
  },

  // Modifier un témoignage
  updateTestimonial: async (id, data) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response;
  },

  // Supprimer un témoignage
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response;
  },

  // Approuver/Désapprouver
  toggleApproval: async (id) => {
    const response = await api.put(`/testimonials/${id}/approve`);
    return response;
  },

  // Mettre en vedette/Retirer
  toggleFeatured: async (id) => {
    const response = await api.put(`/testimonials/${id}/feature`);
    return response;
  },
};

export default testimonialService;