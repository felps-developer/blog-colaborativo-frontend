import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePostsResource } from '@/hooks/api';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useToast } from '@/hooks/use-toast';
import { PAGINATION } from '@/constants';
import { debounce } from '@/utils';
import type { PostListItem } from '@/types/posts';
import type { ApiError } from '@/types/errors';

interface UsePostsOptions {
  authorId?: number;
  autoLoad?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { authorId, autoLoad = true } = options;
  const postsResource = usePostsResource();
  const { handleError } = useErrorHandler();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params: { page: number; per_page: number; title?: string; author_id?: number } = {
        page,
        per_page: PAGINATION.DEFAULT_PER_PAGE,
      };
      
      if (searchTitle.trim()) {
        params.title = searchTitle.trim();
      }
      
      if (authorId) {
        params.author_id = authorId;
      }
      
      const response = await postsResource.listPosts(params);
      setPosts(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err) {
      handleError(err as ApiError, 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, [page, searchTitle, authorId, postsResource, handleError]);

  const performSearch = useCallback(async (searchValue: string) => {
    const params: { page: number; per_page: number; title?: string; author_id?: number } = {
      page: PAGINATION.DEFAULT_PAGE,
      per_page: PAGINATION.DEFAULT_PER_PAGE,
    };
    
    if (searchValue.trim()) {
      params.title = searchValue.trim();
    }
    
    if (authorId) {
      params.author_id = authorId;
    }
    
    try {
      const response = await postsResource.listPosts(params);
      setPosts(response.data.data);
      setTotalPages(response.data.last_page);
      setPage(PAGINATION.DEFAULT_PAGE);
    } catch (err) {
      handleError(err as ApiError, 'Erro ao buscar posts');
    }
  }, [authorId, postsResource, handleError]);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      performSearch(value);
    }, 500),
    [performSearch]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTitle(value);
    setPage(PAGINATION.DEFAULT_PAGE);
    debouncedSearch(value);
  }, [debouncedSearch]);

  useEffect(() => {
    if (autoLoad) {
      loadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, authorId]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    posts,
    loading,
    page,
    totalPages,
    searchTitle,
    setPage: handlePageChange,
    setSearchTitle,
    handleSearchChange,
    loadPosts,
  };
}

