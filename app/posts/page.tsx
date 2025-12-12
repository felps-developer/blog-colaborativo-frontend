'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePostsResource } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PostDialog } from '@/components/posts/PostDialog';
import type { PostListItem } from '@/types/posts';
import { Plus, FileText, Calendar, User } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

export default function PostsPage() {
  const postsResource = usePostsResource();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsResource.listPosts({ page, per_page: 10 });
      setPosts(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDialogSuccess = () => {
    loadPosts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Posts</h1>
            <p className="text-gray-600 text-base">
              Listagem de todos os posts disponíveis
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum post encontrado</h3>
              <p className="text-gray-600 mb-6">Comece criando seu primeiro post!</p>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="bg-[#0052A5] hover:bg-[#003d7a] text-white font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Post
              </Button>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Página
                  </span>
                  <span className="px-3 py-1 bg-[#0052A5] text-white rounded-md font-semibold text-sm">
                    {page}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    de {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}

        {/* Botão Flutuante para Criar Post */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={() => setDialogOpen(true)}
            size="lg"
            className="bg-[#0052A5] hover:bg-[#003d7a] text-white font-semibold shadow-lg hover:shadow-xl transition-all rounded-full h-14 w-14 p-0"
            title="Criar novo post"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Dialog de Criar/Editar Post */}
        <PostDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleDialogSuccess}
        />
      </div>
    </MainLayout>
  );
}

