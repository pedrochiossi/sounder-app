import axios from 'axios';
import axiosRetry from 'axios-retry';


const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

axiosRetry(api, { retries: 3 });

api.interceptors.response.use((response) => {
 return response;
}, async (error) => {
  if (error.response.statusCode === 401) {
    await api.post('/auth/refresh');
  }
  Promise.reject(error);
});

export default api;
