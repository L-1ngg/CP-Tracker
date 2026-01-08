import { apiClient } from './client';
import type { UserHandle } from '@/types';

export interface BindHandleRequest {
  platform: string;
  handle: string;
}

export const crawlerApi = {
  /**
   * 绑定平台账号
   */
  bindHandle: async (userId: number, data: BindHandleRequest): Promise<UserHandle> => {
    const response = await apiClient.post(`/api/crawler/handles/${userId}`, data);
    return response.data;
  },

  /**
   * 解绑平台账号
   */
  unbindHandle: async (userId: number, platform: string): Promise<void> => {
    await apiClient.delete(`/api/crawler/handles/${userId}/${platform}`);
  },

  /**
   * 获取用户绑定的账号列表
   */
  getHandles: async (userId: number): Promise<UserHandle[]> => {
    const response = await apiClient.get(`/api/crawler/handles/${userId}`);
    return response.data;
  },

  /**
   * 手动同步用户数据
   */
  syncUser: async (userId: number): Promise<void> => {
    await apiClient.post(`/api/crawler/sync/user/${userId}`);
  },
};
