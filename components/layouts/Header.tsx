'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/posts" className="flex items-center gap-3 group">
            <div className="bg-[#0052A5] p-2 rounded-lg group-hover:bg-[#003d7a] transition-colors">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0052A5] tracking-tight">Blog Colaborativo</span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/posts">
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium",
                  pathname === '/posts' && "bg-gray-100 text-gray-900"
                )}
              >
                Todos os Posts
              </Button>
            </Link>
            <Link href="/posts/my-posts">
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium",
                  pathname === '/posts/my-posts' && "bg-gray-100 text-gray-900"
                )}
              >
                Meus Posts
              </Button>
            </Link>
            
            {/* Separador */}
            <div className="h-8 w-px bg-gray-300 mx-2" />
            
            {/* Usuário */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
              <div className="bg-[#0052A5] rounded-full p-1.5">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </nav>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-gray-700">
              <span className="sr-only">Menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

