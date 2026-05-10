import api from './api';

const contactService = {
  sendMessage: async (data) => {
    const response = await api.post('/contacts', data);
    return response;
  },
};

export default contactService;
