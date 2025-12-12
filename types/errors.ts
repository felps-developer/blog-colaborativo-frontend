import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  error?: string;
}

export type ApiError = AxiosError<ApiErrorResponse>;

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if ('response' in error) {
      const axiosError = error as ApiError;
      const response = axiosError.response?.data;
      
      if (response?.message) {
        return response.message;
      }
      
      if (response?.errors) {
        const firstError = Object.values(response.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
        if (typeof firstError === 'string') {
          return firstError;
        }
      }
      
      if (response?.error) {
        return response.error;
      }
      
      if (axiosError.response?.status === 401) {
        return 'Não autorizado. Por favor, faça login novamente.';
      }
      
      if (axiosError.response?.status === 403) {
        return 'Você não tem permissão para realizar esta ação.';
      }
      
      if (axiosError.response?.status === 404) {
        return 'Recurso não encontrado.';
      }
      
      if (axiosError.response?.status === 500) {
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      }
    }
    
    return error.message;
  }
  
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

