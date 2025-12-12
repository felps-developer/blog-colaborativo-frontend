import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        // Sincroniza com localStorage para o interceptor do Axios
        if (typeof window !== 'undefined') {
          try {
            if (token) {
              localStorage.setItem('token', token);
            } else {
              localStorage.removeItem('token');
            }
          } catch (e) {
            // Ignora erros de localStorage (SSR, modo privado, etc)
          }
        }
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('token');
          } catch (e) {
            // Ignora erros de localStorage
          }
        }
      },
      isAuthenticated: () => {
        const state = get();
        // Verifica também o localStorage para garantir sincronização
        const tokenFromStorage = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        return !!(state.token || tokenFromStorage) && !!state.user;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

