'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePostsResource } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import type { Post } from '@/types/posts';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postsResource = usePostsResource();
  const { user } = useAuthStore();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const postData = response.data;
      
      // Verificar se o usuário é o autor
      if (user && postData.author.id !== user.id) {
        setError('Você não tem permissão para editar este post');
        router.push(`/posts/${postData.id}`);
        return;
      }

      setPost(postData);
      setTitle(postData.title);
      setContent(postData.content);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await postsResource.updatePost(params.id as string, { title, content });
      router.push(`/posts/${params.id}`);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.title?.[0] ||
        err.response?.data?.errors?.content?.[0] ||
        'Erro ao atualizar post. Tente novamente.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando post...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.push(`/posts/${params.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="shadow-lg border-border">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-2xl">Editar Post</CardTitle>
            <CardDescription className="text-base mt-1">
              Atualize os campos abaixo para editar o post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Título do post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  placeholder="Conteúdo do post"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/posts/${params.id}`)}
                  className="hover:bg-muted"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

