import { Platform } from './crawler';

export type ContestStatus = 'upcoming' | 'ongoing' | 'finished';

export interface Contest {
  id: string;
  name: string;
  platform: Platform;
  startTime: string; // ISO 8601 format
  endTime: string;
  duration: number; // in minutes
  url: string;
  status: ContestStatus;
}

export interface ContestDay {
  date: Date;
  contests: Contest[];
}

// 平台颜色配置
export const PLATFORM_COLORS: Record<Platform, { bg: string; text: string; border: string }> = {
  CODEFORCES: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
  },
  ATCODER: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-300 dark:border-pink-700',
  },
  NOWCODER: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700',
  },
};

// 比赛状态颜色
export const STATUS_COLORS: Record<ContestStatus, { bg: string; text: string }> = {
  upcoming: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  ongoing: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
  },
  finished: {
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    text: 'text-gray-500 dark:text-gray-400',
  },
};
