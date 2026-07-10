import api from './api';

export const aiService = {
  askQuestion: async (prompt) => {
    const res = await api.post('/ai/query', { prompt });
    return res.data;
  },
};
