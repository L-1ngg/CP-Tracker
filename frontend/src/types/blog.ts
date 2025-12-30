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

export interface BlogListResponse {
  content: Blog[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
