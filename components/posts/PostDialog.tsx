'use client';

import { useState, useEffect } from 'react';
import { usePostsResource } from '@/hooks/api';
import { useAuthStore } from '@/stores/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichEditor } from '@/components/editor/RichEditor';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, type ApiError } from '@/types/errors';
import type { Post } from '@/types/posts';

interface PostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: Post | null;
  onSuccess?: () => void;
}

export function PostDialog({ open, onOpenChange, post, onSuccess }: PostDialogProps) {
  const postsResource = usePostsResource();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!post;
  const isAuthor = post && user && post.author.id === user.id;

  useEffect(() => {
    if (open) {
      if (post) {
        setTitle(post.title);
        setContent(post.content);
      } else {
        setTitle('');
        setContent('');
      }
    }
  }, [open, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && post) {
        await postsResource.updatePost(post.id, { title, content });
        toast({
          title: 'Post atualizado',
          description: 'O post foi atualizado com sucesso.',
        });
      } else {
        await postsResource.createPost({ title, content });
        toast({
          title: 'Post criado',
          description: 'O post foi criado com sucesso.',
        });
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const error = err as ApiError;
      toast({
        variant: 'destructive',
        title: `Erro ao ${isEditing ? 'atualizar' : 'criar'} post`,
        description: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Post' : 'Criar Novo Post'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing 
              ? 'Atualize os campos abaixo para editar o post'
              : 'Preencha os campos abaixo para criar um novo post'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">Título</Label>
            <Input
              id="title"
              type="text"
              placeholder="Título do post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-base font-semibold">Conteúdo</Label>
            <RichEditor
              content={content}
              onChange={setContent}
              placeholder="Comece a escrever seu post..."
            />
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="bg-[#0052A5] hover:bg-[#003d7a] text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {loading 
                ? (isEditing ? 'Salvando...' : 'Criando...') 
                : (isEditing ? 'Salvar Alterações' : 'Criar Post')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

