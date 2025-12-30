export interface DailyActivity {
  userId: number;
  date: string;
  count: number;
  platformBreakdown: string;
}

export interface SkillRadar {
  id: number;
  userId: number;
  tag: string;
  rating: number;
  solvedCount: number;
}

export interface UserRating {
  userId: number;
  unifiedRating: number;
  cfRating: number | null;
  nkRating: number | null;
  atRating: number | null;
  updatedAt: string;
}
