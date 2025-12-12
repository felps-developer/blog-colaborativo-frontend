import { api } from '@/lib/api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth';

export function useAuthResource() {
  /**
   * Realiza o login do usuário
   */
  function login(credentials: LoginCredentials): Promise<{ data: AuthResponse }> {
    return api.post<AuthResponse>('/auth/login', credentials);
  }

  /**
   * Registra um novo usuário
   */
  function register(data: RegisterData): Promise<{ data: AuthResponse }> {
    return api.post<AuthResponse>('/auth/register', data);
  }

  /**
   * Obtém os dados do usuário logado
   */
  function getProfile(): Promise<{ data: User }> {
    return api.get<User>('/auth/me');
  }

  /**
   * Faz logout do usuário
   */
  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  return {
    login,
    register,
    getProfile,
    logout,
  };
}

