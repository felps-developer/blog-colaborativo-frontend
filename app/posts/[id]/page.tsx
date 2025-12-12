'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePostsResource } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Post } from '@/types/posts';
import { Calendar, User, Edit, Trash2, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postsResource = usePostsResource();
  const { user } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadPost();
    }
  }, [params.id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsResource.getPost(params.id as string);
      setPost(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !confirm('Tem certeza que deseja excluir este post?')) {
      return;
    }

    try {
      setDeleting(true);
      await postsResource.deletePost(post.id);
      router.push('/posts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir post');
    } finally {
      setDeleting(false);
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

  const isAuthor = post && user && post.author.id === user.id;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.push('/posts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando post...</p>
          </div>
        ) : post ? (
          <Card className="shadow-lg border-border">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3 text-foreground leading-tight">{post.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{post.author.name}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.created_at)}
                    </span>
                  </CardDescription>
                </div>
                {isAuthor && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/posts/${post.id}/edit`)}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-wrap text-foreground leading-relaxed text-base">
                  {post.content}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Post não encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

