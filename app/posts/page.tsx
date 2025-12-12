'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePostsResource } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Posts</h1>
            <p className="text-muted-foreground mt-1.5">
              Listagem de todos os posts disponíveis
            </p>
          </div>
          <Link href="/posts/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum post encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-border hover:border-primary/50 group">
                    <CardHeader className="pb-4">
                      <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span className="font-medium">{post.author.name}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
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
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

