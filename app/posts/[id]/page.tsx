'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePostsResource } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PostDialog } from '@/components/posts/PostDialog';
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
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleDialogSuccess = () => {
    loadPost();
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
        <Button 
          variant="ghost" 
          onClick={() => router.push('/posts')}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0052A5] border-t-transparent mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium">Carregando post...</p>
          </div>
        ) : post ? (
          <Card className="shadow-xl border border-gray-200 bg-white">
            <CardHeader className="pb-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-4xl mb-4 text-gray-900 leading-tight font-bold">{post.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-4 text-sm pt-2">
                    <span className="flex items-center gap-2 text-gray-600">
                      <div className="bg-[#0052A5]/10 rounded-full p-1.5">
                        <User className="h-4 w-4 text-[#0052A5]" />
                      </div>
                      <span className="font-semibold text-gray-700">{post.author.name}</span>
                    </span>
                    <span className="flex items-center gap-2 text-gray-500">
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
                      onClick={() => setDialogOpen(true)}
                      className="border-gray-300 text-gray-700 hover:bg-[#0052A5] hover:text-white hover:border-[#0052A5]"
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
            <CardContent className="pt-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Post não encontrado</p>
            </CardContent>
          </Card>
        )}

        {/* Dialog de Editar Post */}
        {post && (
          <PostDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            post={post}
            onSuccess={handleDialogSuccess}
          />
        )}
      </div>
    </MainLayout>
  );
}

