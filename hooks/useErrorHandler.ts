import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, type ApiError } from '@/types/errors';

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, defaultMessage: string) => {
      const apiError = error as ApiError;
      toast({
        variant: 'destructive',
        title: defaultMessage,
        description: getErrorMessage(apiError),
      });
    },
    [toast]
  );

  return { handleError };
}

