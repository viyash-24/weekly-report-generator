import api from './api';

export const projectService = {
  getProjects: async (params = {}) => {
    const res = await api.get('/projects', { params });
    return res.data.data;
  },
  getProject: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data.data;
  },
  createProject: async (data) => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  updateProject: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },
};
