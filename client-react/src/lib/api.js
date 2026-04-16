import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong.';
    const code = err.response?.data?.error || 'UNKNOWN_ERROR';
    const error = new Error(message);
    error.code = code;
    error.status = err.response?.status;
    return Promise.reject(error);
  }
);

export default api;
