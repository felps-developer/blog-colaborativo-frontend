'use client';

import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { Pagination } from '@/components/shared/Pagination';
import { Loading } from '@/components/shared/Loading';
import { PostCard } from '@/components/posts/PostCard';
import { usePosts } from '@/hooks/usePosts';

export default function PostsPage() {
  const { posts, loading, page, totalPages, searchTitle, setPage, handleSearchChange } = usePosts();

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header da Página */}
        <div className="flex flex-col gap-6 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Todos os Posts</h1>
            <p className="text-gray-600 text-base">
              Explore todos os posts da comunidade
            </p>
          </div>
          
          {/* Barra de Pesquisa */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar por título..."
              value={searchTitle}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        {loading ? (
          <Loading message="Carregando posts..." />
        ) : posts.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
            <CardContent className="py-20 text-center">
              <div className="bg-[#0052A5]/10 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FileText className="h-10 w-10 text-[#0052A5]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTitle ? 'Nenhum post encontrado' : 'Nenhum post disponível'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTitle 
                  ? 'Tente pesquisar com outros termos' 
                  : 'Ainda não há posts publicados'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  linkTo={`/posts/${post.id}`}
                />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

      </div>
    </MainLayout>
  );
}

