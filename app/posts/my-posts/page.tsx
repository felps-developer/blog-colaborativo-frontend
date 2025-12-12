'use client';

import { useState } from 'react';
import { usePostsResource } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PostDialog } from '@/components/posts/PostDialog';
import { PostCard } from '@/components/posts/PostCard';
import { Loading } from '@/components/shared/Loading';
import { usePosts } from '@/hooks/usePosts';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { Post } from '@/types/posts';
import { Plus, FileText } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { Pagination } from '@/components/shared/Pagination';
import { confirmDeletePost } from '@/utils';

export default function MyPostsPage() {
  const postsResource = usePostsResource();
  const { user } = useAuthStore();
  const { handleError } = useErrorHandler();
  const { posts, loading, page, totalPages, setPage, loadPosts } = usePosts({
    authorId: user?.id,
    autoLoad: !!user?.id,
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
      handleError(err, 'Erro ao carregar post');
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
      await loadPosts();
    } catch (err) {
      handleError(err, 'Erro ao excluir post');
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
          <Loading message="Carregando posts..." />
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
                <PostCard
                  key={post.id}
                  post={post}
                  showActions
                  linkTo={`/posts/${post.id}`}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  deletingId={deletingId}
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

