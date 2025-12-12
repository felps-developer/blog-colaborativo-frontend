'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePostsResource } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PostDialog } from '@/components/posts/PostDialog';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, type ApiError } from '@/types/errors';
import type { PostListItem, Post } from '@/types/posts';
import { Plus, FileText, Calendar, Edit, Trash2 } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { Pagination } from '@/components/shared/Pagination';
import { formatDate, confirmDeletePost } from '@/utils';

export default function MyPostsPage() {
  const router = useRouter();
  const postsResource = usePostsResource();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadPosts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await postsResource.listPosts({ 
        page, 
        per_page: 10,
        author_id: user.id 
      });
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
  }, [page, user?.id, postsResource, toast]);

  useEffect(() => {
    if (user?.id) {
      loadPosts();
    }
  }, [loadPosts, user?.id]);

  const handleCreateClick = () => {
    setEditingPost(null);
    setDialogOpen(true);
  };

  const handleEditClick = async (postId: number) => {
    try {
      const response = await postsResource.getPost(postId);
      setEditingPost(response.data);
      setDialogOpen(true);
    } catch (err) {
      const error = err as ApiError;
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar post',
        description: getErrorMessage(error),
      });
    }
  };

  const handleDeleteClick = async (postId: number) => {
    const confirmed = await confirmDeletePost();
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(postId);
      await postsResource.deletePost(postId);
      toast({
        title: 'Post excluído',
        description: 'O post foi excluído com sucesso.',
      });
      loadPosts();
    } catch (err) {
      const error = err as ApiError;
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir post',
        description: getErrorMessage(error),
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogSuccess = () => {
    setDialogOpen(false);
    setEditingPost(null);
    loadPosts();
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Meus Posts</h1>
            <p className="text-gray-600 text-base">
              Gerencie seus posts criados
            </p>
          </div>
          <Button
            onClick={handleCreateClick}
            className="bg-[#0052A5] hover:bg-[#003d7a] text-white font-semibold shadow-md hover:shadow-lg transition-all h-11 px-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Post
          </Button>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum post criado</h3>
              <p className="text-gray-600 mb-6">Comece criando seu primeiro post!</p>
              <Button
                onClick={handleCreateClick}
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
                <Card 
                  key={post.id} 
                  className="hover:shadow-xl transition-all duration-300 h-full border-gray-200 hover:border-[#0052A5]/30 bg-white group overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-[#0052A5] transition-colors mb-3 leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.created_at)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/posts/${post.id}`)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(post.id)}
                        className="border-[#0052A5] text-[#0052A5] hover:bg-[#0052A5] hover:text-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(post.id)}
                        disabled={deletingId === post.id}
                        className="px-3"
                      >
                        {deletingId === post.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}

        {/* Dialog de Criar/Editar Post */}
        <PostDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingPost(null);
            }
          }}
          post={editingPost}
          onSuccess={handleDialogSuccess}
        />
      </div>
    </MainLayout>
  );
}

