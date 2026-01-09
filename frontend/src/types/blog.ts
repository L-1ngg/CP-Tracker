export interface Blog {
  id: number;
  authorId: number;
  title: string;
  summary: string;
  content: string;
  coverUrl: string | null;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED';
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface CreateBlogRequest {
  title: string;
  summary: string;
  content: string;
  coverUrl?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  summary?: string;
  content?: string;
  coverUrl?: string;
}

export interface BlogListResponse {
  content: Blog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface BlogTag {
  id: number;
  name: string;
}

export interface BlogComment {
  id: number;
  blogId: number;
  userId: number;
  content: string;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCommentListResponse {
  content: BlogComment[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: number;
}

export interface LikeStatusResponse {
  hasLiked: boolean;
  likeCount: number;
}
