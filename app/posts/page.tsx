'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePostsResource } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PostListItem } from '@/types/posts';
import { FileText, Calendar, User, Search } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { Pagination } from '@/components/shared/Pagination';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, type ApiError } from '@/types/errors';
import { formatDate, debounce } from '@/utils';

export default function PostsPage() {
  const postsResource = usePostsResource();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState('');

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params: { page: number; per_page: number; title?: string } = {
        page,
        per_page: 10,
      };
      if (searchTitle.trim()) {
        params.title = searchTitle.trim();
      }
      const response = await postsResource.listPosts(params);
      setPosts(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err) {
      const error = err as ApiError;
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar posts',
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback(async (searchValue: string) => {
    const params: { page: number; per_page: number; title?: string } = {
      page: 1,
      per_page: 10,
    };
    if (searchValue.trim()) {
      params.title = searchValue.trim();
    }
    try {
      const response = await postsResource.listPosts(params);
      setPosts(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err) {
      const error = err as ApiError;
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar posts',
        description: getErrorMessage(error),
      });
    }
  }, [postsResource, toast]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      performSearch(value);
    }, 500),
    [performSearch]
  );

  const handleSearchChange = (value: string) => {
    setSearchTitle(value);
    setPage(1); // Reset para primeira página ao buscar
    debouncedSearch(value);
  };

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
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0052A5] border-t-transparent mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium">Carregando posts...</p>
          </div>
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
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-gray-200 hover:border-[#0052A5]/30 bg-white group overflow-hidden">
                    <CardHeader className="pb-4">
                      <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-[#0052A5] transition-colors mb-3 leading-tight">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="bg-[#0052A5]/10 rounded-full p-1.5">
                            <User className="h-3.5 w-3.5 text-[#0052A5]" />
                          </div>
                          <span className="font-medium">{post.author.name}</span>
                        </span>
                        <span className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(post.created_at)}
                        </span>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
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

