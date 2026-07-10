import api from './api';
import Cookies from 'js-cookie';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('tc_token', res.data.token);
      localStorage.setItem('tc_user', JSON.stringify(res.data.data));
      Cookies.set('tc_token', res.data.token, { expires: 7 });
    }
    return res.data;
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('tc_token', res.data.token);
      localStorage.setItem('tc_user', JSON.stringify(res.data.data));
      Cookies.set('tc_token', res.data.token, { expires: 7 });
    }
    return res.data;
  },
  logout: async () => {
    localStorage.removeItem('tc_token');
    localStorage.removeItem('tc_user');
    Cookies.remove('tc_token');
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore
    }
  },
  getStoredUser: () => {
    const user = localStorage.getItem('tc_user');
    return user ? JSON.parse(user) : null;
  },
  getStoredToken: () => {
    return localStorage.getItem('tc_token');
  },
};
