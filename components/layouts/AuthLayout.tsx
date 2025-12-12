'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useAuthResource } from '@/hooks/api';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const authResource = useAuthResource();
  const { setUser, setToken, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !isAuthenticated()) {
        try {
          const response = await authResource.getProfile();
          setUser(response.data);
          setToken(token);
          router.push('/posts');
        } catch (error) {
          // Token inválido, limpar e deixar na página de auth
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, [mounted, router, authResource, setUser, setToken, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
}

