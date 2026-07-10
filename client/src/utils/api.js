import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // For refresh tokens in cookies
});

// Request interceptor to add access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401s and token refresh (simplified)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
        if (res.data.success) {
          localStorage.setItem('accessToken', res.data.data.accessToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        // Do not force a window reload here, just reject. 
        // The calling function (e.g. AuthContext) will handle the error and update state appropriately.
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
