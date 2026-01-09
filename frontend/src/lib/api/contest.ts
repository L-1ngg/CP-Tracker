import { apiClient } from './client';
import type { Contest } from '@/types';

// 格式化日期为 ISO 字符串，但保持本地时区
const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// 模拟比赛数据（用于开发测试）
const generateMockContests = (): Contest[] => {
  const now = new Date();
  const contests: Contest[] = [];

  // Codeforces 比赛
  contests.push({
    id: 'cf-1',
    name: 'Codeforces Round 920 (Div. 2)',
    platform: 'CODEFORCES',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 22, 35)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 0, 35)),
    duration: 120,
    url: 'https://codeforces.com/contest/1921',
    status: 'upcoming',
  });

  contests.push({
    id: 'cf-2',
    name: 'Codeforces Round 921 (Div. 1)',
    platform: 'CODEFORCES',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 22, 35)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 1, 5)),
    duration: 150,
    url: 'https://codeforces.com/contest/1922',
    status: 'upcoming',
  });

  contests.push({
    id: 'cf-3',
    name: 'Educational Codeforces Round 161',
    platform: 'CODEFORCES',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 22, 35)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 0, 35)),
    duration: 120,
    url: 'https://codeforces.com/contest/1923',
    status: 'upcoming',
  });

  // AtCoder 比赛
  contests.push({
    id: 'atc-1',
    name: 'AtCoder Beginner Contest 340',
    platform: 'ATCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 20, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 21, 40)),
    duration: 100,
    url: 'https://atcoder.jp/contests/abc340',
    status: 'upcoming',
  });

  contests.push({
    id: 'atc-2',
    name: 'AtCoder Regular Contest 170',
    platform: 'ATCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 21, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4, 23, 0)),
    duration: 120,
    url: 'https://atcoder.jp/contests/arc170',
    status: 'upcoming',
  });

  contests.push({
    id: 'atc-3',
    name: 'AtCoder Grand Contest 066',
    platform: 'ATCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 21, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 0, 0)),
    duration: 180,
    url: 'https://atcoder.jp/contests/agc066',
    status: 'upcoming',
  });

  // NowCoder 比赛
  contests.push({
    id: 'nc-1',
    name: '牛客周赛 Round 30',
    platform: 'NOWCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 30)),
    duration: 90,
    url: 'https://ac.nowcoder.com/acm/contest/73152',
    status: 'ongoing',
  });

  contests.push({
    id: 'nc-2',
    name: '牛客小白月赛 86',
    platform: 'NOWCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 19, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6, 21, 0)),
    duration: 120,
    url: 'https://ac.nowcoder.com/acm/contest/73153',
    status: 'upcoming',
  });

  // 添加一些过去的比赛
  contests.push({
    id: 'cf-past-1',
    name: 'Codeforces Round 919 (Div. 2)',
    platform: 'CODEFORCES',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 22, 35)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 35)),
    duration: 120,
    url: 'https://codeforces.com/contest/1920',
    status: 'finished',
  });

  contests.push({
    id: 'atc-past-1',
    name: 'AtCoder Beginner Contest 339',
    platform: 'ATCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 20, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 21, 40)),
    duration: 100,
    url: 'https://atcoder.jp/contests/abc339',
    status: 'finished',
  });

  // 今天的比赛
  contests.push({
    id: 'cf-today',
    name: 'Codeforces Round 922 (Div. 3)',
    platform: 'CODEFORCES',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 35)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 50)),
    duration: 135,
    url: 'https://codeforces.com/contest/1924',
    status: 'upcoming',
  });

  // 同一天多场比赛
  contests.push({
    id: 'multi-1',
    name: 'Codeforces Global Round 25',
    platform: 'CODEFORCES',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 22, 35)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 9, 1, 5)),
    duration: 150,
    url: 'https://codeforces.com/contest/1925',
    status: 'upcoming',
  });

  contests.push({
    id: 'multi-2',
    name: 'AtCoder Beginner Contest 341',
    platform: 'ATCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 20, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 21, 40)),
    duration: 100,
    url: 'https://atcoder.jp/contests/abc341',
    status: 'upcoming',
  });

  contests.push({
    id: 'multi-3',
    name: '牛客周赛 Round 31',
    platform: 'NOWCODER',
    startTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 19, 0)),
    endTime: formatLocalDateTime(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 20, 30)),
    duration: 90,
    url: 'https://ac.nowcoder.com/acm/contest/73154',
    status: 'upcoming',
  });

  return contests;
};

export const contestApi = {
  // 获取所有比赛
  getContests: async (): Promise<Contest[]> => {
    // TODO: 替换为真实 API 调用
    // const response = await apiClient.get<Contest[]>('/api/contests');
    // return response.data;

    // 暂时返回模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockContests());
      }, 500);
    });
  },

  // 获取即将开始的比赛
  getUpcomingContests: async (): Promise<Contest[]> => {
    const contests = await contestApi.getContests();
    return contests.filter((c) => c.status === 'upcoming');
  },

  // 获取正在进行的比赛
  getOngoingContests: async (): Promise<Contest[]> => {
    const contests = await contestApi.getContests();
    return contests.filter((c) => c.status === 'ongoing');
  },

  // 获取指定月份的比赛
  getContestsByMonth: async (year: number, month: number): Promise<Contest[]> => {
    const contests = await contestApi.getContests();
    return contests.filter((c) => {
      const date = new Date(c.startTime);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  },
};
