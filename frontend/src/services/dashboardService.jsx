import api from './api';

export const dashboardService = {
  getManagerDashboard: async () => {
    const res = await api.get('/dashboard/manager');
    return res.data.data;
  },
  getMemberDashboard: async () => {
    const res = await api.get('/dashboard/member');
    return res.data.data;
  },
  getSubmissionChart: async () => {
    const res = await api.get('/dashboard/analytics/submissions');
    return res.data.data;
  },
  getProjectWorkload: async () => {
    const res = await api.get('/dashboard/analytics/projects');
    return res.data.data;
  },
  getTeamProductivity: async () => {
    const res = await api.get('/dashboard/analytics/productivity');
    return res.data.data;
  },
};
