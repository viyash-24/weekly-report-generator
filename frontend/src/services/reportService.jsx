import api from './api';

export const reportService = {
  getReports: async (params) => {
    const res = await api.get('/reports', { params });
    return res.data;
  },
  getReport: async (id) => {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  },
  createReport: async (data) => {
    const res = await api.post('/reports', data);
    return res.data;
  },
  saveDraft: async (data) => {
    const res = await api.post('/reports', { ...data, status: 'Draft' });
    return res.data;
  },
  submitReport: async (data) => {
    const res = await api.post('/reports', { ...data, status: 'Submitted' });
    return res.data;
  },
  updateReport: async (id, data) => {
    const res = await api.put(`/reports/${id}`, data);
    return res.data;
  },
  deleteReport: async (id) => {
    const res = await api.delete(`/reports/${id}`);
    return res.data;
  },
};
