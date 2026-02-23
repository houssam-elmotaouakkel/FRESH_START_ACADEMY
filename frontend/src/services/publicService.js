import api from './api';

const publicService = {
  getLandingContent: async () => {
    const response = await api.get('/public/landing');
    return response;
  },

  trackEvent: async (event) => {
    const response = await api.post('/public/events', event);
    return response;
  },

  trackEventsBatch: async (events) => {
    const response = await api.post('/public/events/batch', { events });
    return response;
  },
};

export default publicService;
