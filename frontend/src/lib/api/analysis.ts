import { apiClient } from './client';
import type { DailyActivity, SkillRadar, UserRating } from '@/types';

export const analysisApi = {
  getHeatmap: async (userId: number, days = 365): Promise<DailyActivity[]> => {
    const response = await apiClient.get<DailyActivity[]>(
      `/api/analysis/heatmap/${userId}`,
      { params: { days } }
    );
    return response.data;
  },

  getSkills: async (userId: number): Promise<SkillRadar[]> => {
    const response = await apiClient.get<SkillRadar[]>(
      `/api/analysis/skills/${userId}`
    );
    return response.data;
  },

  getRating: async (userId: number): Promise<UserRating> => {
    const response = await apiClient.get<UserRating>(
      `/api/analysis/rating/${userId}`
    );
    return response.data;
  },
};
