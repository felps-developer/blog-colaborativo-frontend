import { api } from '@/lib/api';
import type {
  Post,
  PostListItem,
  PostsListResponse,
  CreatePostData,
  UpdatePostData,
} from '@/types/posts';

interface ListPostsParams {
  page?: number;
  per_page?: number;
  title?: string;
  author_id?: number;
}

export function usePostsResource() {
  /**
   * Lista todos os posts
   */
  function listPosts(params?: ListPostsParams): Promise<{ data: PostsListResponse }> {
    return api.get<PostsListResponse>('/posts', { params });
  }

  /**
   * Busca um post pelo ID
   */
  function getPost(id: number | string): Promise<{ data: Post }> {
    return api.get<Post>(`/posts/${id}`);
  }

  /**
   * Cria um novo post
   */
  function createPost(data: CreatePostData): Promise<{ data: Post }> {
    return api.post<Post>('/posts', data);
  }

  /**
   * Atualiza um post
   */
  function updatePost(id: number | string, data: UpdatePostData): Promise<{ data: Post }> {
    return api.put<Post>(`/posts/${id}`, data);
  }

  /**
   * Remove um post
   */
  function deletePost(id: number | string): Promise<{ data: { message: string } }> {
    return api.delete<{ message: string }>(`/posts/${id}`);
  }

  return {
    listPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
  };
}

