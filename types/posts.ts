export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PostListItem {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PostsListResponse {
  data: PostListItem[];
  total: number;
  page: number;
  last_page: number;
  per_page: number;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

