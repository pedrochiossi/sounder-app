/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: `${process.env.PUBLIC_URL}/api`,
});

axiosRetry(api, { retries: 3 });

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await api.post('/auth/refresh');
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default api;
