import { useState, useEffect, useCallback } from 'react';
import { usePostsResource } from '@/hooks/api';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { Post } from '@/types/posts';
import type { ApiError } from '@/types/errors';

export function usePostDetail(postId: string | number) {
  const postsResource = usePostsResource();
  const { handleError } = useErrorHandler();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postsResource.getPost(postId);
      setPost(response.data);
    } catch (err) {
      handleError(err as ApiError, 'Erro ao carregar post');
    } finally {
      setLoading(false);
    }
  }, [postId, postsResource, handleError]);

  const deletePost = useCallback(async () => {
    try {
      setDeleting(true);
      await postsResource.deletePost(postId);
      return true;
    } catch (err) {
      handleError(err as ApiError, 'Erro ao excluir post');
      return false;
    } finally {
      setDeleting(false);
    }
  }, [postId, postsResource, handleError]);

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId, loadPost]);

  return {
    post,
    loading,
    deleting,
    loadPost,
    deletePost,
  };
}

