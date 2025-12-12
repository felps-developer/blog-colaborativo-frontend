'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useAuthResource } from '@/hooks/api';
import { Header } from './Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, setUser, setToken } = useAuthStore();
  const authResource = useAuthResource();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hasLoadedRef.current) return;

    const loadProfile = async () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        setLoading(false);
        return;
      }

      if (!isAuthenticated()) {
        try {
          const response = await authResource.getProfile();
          setUser(response.data);
          setToken(token);
        } catch (error) {
          router.push('/auth/login');
        }
      }
      setLoading(false);
      hasLoadedRef.current = true;
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0052A5] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

