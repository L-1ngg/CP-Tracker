import { apiClient } from './client';
import type { Blog, CreateBlogRequest, BlogListResponse } from '@/types';

export const blogApi = {
  getBlogs: async (page = 0, size = 10): Promise<BlogListResponse> => {
    const response = await apiClient.get<BlogListResponse>('/api/core/blogs', {
      params: { page, size },
    });
    return response.data;
  },

  createBlog: async (data: CreateBlogRequest, userId: number): Promise<Blog> => {
    const response = await apiClient.post<Blog>('/api/core/blogs', data, {
      headers: { 'X-User-Id': userId.toString() },
    });
    return response.data;
  },

  submitBlog: async (blogId: number): Promise<void> => {
    await apiClient.post(`/api/core/blogs/${blogId}/submit`);
  },
};
