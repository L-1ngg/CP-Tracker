import { apiClient } from './client';
import type {
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogListResponse,
  BlogTag,
  BlogComment,
  BlogCommentListResponse,
  CreateCommentRequest,
  LikeStatusResponse,
} from '@/types';

export const blogApi = {
  // ========== 博客 CRUD ==========

  getBlogs: async (page = 0, size = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/api/core/blogs', {
      params: { page, size },
    });
    return response.data;
  },

  getBlogById: async (id: number): Promise<Blog> => {
    const response = await apiClient.get<Blog>(`/api/core/blogs/${id}`);
    return response.data;
  },

  createBlog: async (data: CreateBlogRequest): Promise<Blog> => {
    const response = await apiClient.post<Blog>('/api/core/blogs', data);
    return response.data;
  },

  updateBlog: async (id: number, data: UpdateBlogRequest): Promise<Blog> => {
    const response = await apiClient.put<Blog>(`/api/core/blogs/${id}`, data);
    return response.data;
  },

  deleteBlog: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/core/blogs/${id}`);
  },

  submitBlog: async (blogId: number): Promise<void> => {
    await apiClient.post(`/api/core/blogs/${blogId}/submit`);
  },

  // ========== 我的博客 ==========

  getMyBlogs: async (page = 0, size = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/api/core/blogs/my', {
      params: { page, size },
    });
    return response.data;
  },

  getMyDrafts: async (page = 0, size = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/api/core/blogs/my/drafts', {
      params: { page, size },
    });
    return response.data;
  },

  // ========== 点赞 ==========

  likeBlog: async (blogId: number): Promise<void> => {
    await apiClient.post(`/api/core/blogs/${blogId}/like`);
  },

  unlikeBlog: async (blogId: number): Promise<void> => {
    await apiClient.delete(`/api/core/blogs/${blogId}/like`);
  },

  getLikeStatus: async (blogId: number): Promise<LikeStatusResponse> => {
    const response = await apiClient.get<LikeStatusResponse>(`/api/core/blogs/${blogId}/like/status`);
    return response.data;
  },

  // ========== 评论 ==========

  getComments: async (blogId: number, page = 0, size = 20): Promise<BlogCommentListResponse> => {
    const response = await apiClient.get<BlogCommentListResponse>(`/api/core/blogs/${blogId}/comments`, {
      params: { page, size },
    });
    return response.data;
  },

  createComment: async (blogId: number, data: CreateCommentRequest): Promise<BlogComment> => {
    const response = await apiClient.post<BlogComment>(`/api/core/blogs/${blogId}/comments`, data);
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/api/core/comments/${commentId}`);
  },

  getReplies: async (commentId: number): Promise<BlogComment[]> => {
    const response = await apiClient.get<BlogComment[]>(`/api/core/comments/${commentId}/replies`);
    return response.data;
  },

  // ========== 标签 ==========

  getAllTags: async (): Promise<BlogTag[]> => {
    const response = await apiClient.get<BlogTag[]>('/api/core/tags');
    return response.data;
  },

  getBlogTags: async (blogId: number): Promise<BlogTag[]> => {
    const response = await apiClient.get<BlogTag[]>(`/api/core/blogs/${blogId}/tags`);
    return response.data;
  },

  setBlogTags: async (blogId: number, tagIds: number[]): Promise<void> => {
    await apiClient.put(`/api/core/blogs/${blogId}/tags`, tagIds);
  },

  getBlogsByTag: async (tagId: number, page = 0, size = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>(`/api/core/blogs/by-tag/${tagId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // ========== 管理员 ==========

  getPendingBlogs: async (page = 0, size = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/api/core/admin/blogs/pending', {
      params: { page, size },
    });
    return response.data;
  },

  reviewBlog: async (blogId: number, action: 'APPROVE' | 'REJECT', comment?: string): Promise<void> => {
    await apiClient.post('/api/core/admin/blogs/review', {
      blogId,
      action,
      comment,
    });
  },

  createTag: async (name: string): Promise<BlogTag> => {
    const response = await apiClient.post<BlogTag>('/api/core/admin/tags', { name });
    return response.data;
  },

  deleteTag: async (tagId: number): Promise<void> => {
    await apiClient.delete(`/api/core/admin/tags/${tagId}`);
  },
};
