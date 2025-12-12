'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useAuthResource } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { LogOut, User, FileText, Plus } from 'lucide-react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, setUser, setToken } = useAuthStore();
  const authResource = useAuthResource();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
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
    };

    loadProfile();
  }, [mounted, router, authResource, setUser, setToken, isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/posts" className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">Blog Colaborativo</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/posts">
              <Button variant={pathname === '/posts' ? 'default' : 'ghost'}>
                Posts
              </Button>
            </Link>
            <Link href="/posts/new">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Post
              </Button>
            </Link>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

