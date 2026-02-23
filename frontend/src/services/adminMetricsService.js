import api from './api';

const adminMetricsService = {
  getConversionMetrics: async (params = {}) => {
    const response = await api.get('/admin/metrics/conversion', { params });
    return response;
  },
};

export default adminMetricsService;
