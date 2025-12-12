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
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/posts" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-primary p-2 rounded-lg">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Blog Colaborativo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <Link href="/posts">
                <Button 
                  variant={pathname === '/posts' ? 'default' : 'ghost'}
                  className={pathname === '/posts' ? 'bg-primary text-primary-foreground' : ''}
                >
                  Posts
                </Button>
              </Link>
              <Link href="/posts/new">
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Post
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{user?.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="hover:bg-muted"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
            {/* Menu mobile */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <span className="sr-only">Menu</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}

