export interface UserHandle {
  userId: number;
  platform: string;
  handle: string;
  lastFetched?: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
}

export type Platform = 'CODEFORCES' | 'ATCODER' | 'NOWCODER';

export const PLATFORM_LABELS: Record<Platform, string> = {
  CODEFORCES: 'Codeforces',
  ATCODER: 'AtCoder',
  NOWCODER: 'NowCoder',
};
