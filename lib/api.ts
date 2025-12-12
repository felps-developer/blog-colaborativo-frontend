import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URI = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    // Recupera o token do localStorage (client-side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    // Verifica se a resposta contém um token e o armazena
    if (response.data && typeof window !== 'undefined') {
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    // Verifica se o erro é 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Redireciona para a página de login usando router do Next.js
        const currentPath = window.location.pathname;
        if (currentPath !== '/auth/login' && currentPath !== '/auth/register') {
          // Usar setTimeout para evitar problemas de hidratação
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 0);
        }
      }
    }
    return Promise.reject(error);
  }
);

export { api, API_URI };

