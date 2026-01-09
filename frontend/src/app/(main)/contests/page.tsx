'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Filter, List } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ContestCalendar } from '@/components/contest';
import { contestApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  STATUS_COLORS,
  type Contest,
  type Platform,
} from '@/types';

type ViewMode = 'calendar' | 'list';

export default function ContestsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    'CODEFORCES',
    'ATCODER',
    'NOWCODER',
  ]);

  const { data: contests, isLoading } = useQuery({
    queryKey: ['contests'],
    queryFn: contestApi.getContests,
  });

  const filteredContests =
    contests?.filter((c) => selectedPlatforms.includes(c.platform)) || [];

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const upcomingContests = filteredContests
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const ongoingContests = filteredContests.filter((c) => c.status === 'ongoing');

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">比赛日历</h1>
          <p className="text-muted-foreground mt-1">
            查看 Codeforces、AtCoder、NowCoder 的比赛安排
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* 视图切换 */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              日历
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-1" />
              列表
            </Button>
          </div>
        </div>
      </div>

      {/* 平台筛选 */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">平台筛选:</span>
        {(['CODEFORCES', 'ATCODER', 'NOWCODER'] as const).map((platform) => {
          const isSelected = selectedPlatforms.includes(platform);
          const colors = PLATFORM_COLORS[platform];
          return (
            <Button
              key={platform}
              variant="outline"
              size="sm"
              onClick={() => togglePlatform(platform)}
              className={cn(
                'transition-all',
                isSelected && [colors.bg, colors.text, colors.border]
              )}
            >
              {PLATFORM_LABELS[platform]}
            </Button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      ) : viewMode === 'calendar' ? (
        /* 日历视图 */
        <Card className="rounded-2xl shadow-apple">
          <CardContent className="p-6">
            <ContestCalendar contests={filteredContests} />
          </CardContent>
        </Card>
      ) : (
        /* 列表视图 */
        <div className="space-y-6">
          {/* 正在进行的比赛 */}
          {ongoingContests.length > 0 && (
            <Card className="rounded-2xl shadow-apple border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  正在进行
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {ongoingContests.map((contest) => (
                    <ContestListItem key={contest.id} contest={contest} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 即将开始的比赛 */}
          <Card className="rounded-2xl shadow-apple">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">即将开始</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {upcomingContests.length > 0 ? (
                <div className="space-y-3">
                  {upcomingContests.map((contest) => (
                    <ContestListItem key={contest.id} contest={contest} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  暂无即将开始的比赛
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ContestListItem({ contest }: { contest: Contest }) {
  const colors = PLATFORM_COLORS[contest.platform];
  const statusColors = STATUS_COLORS[contest.status];

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}小时${mins}分钟`;
    } else if (hours > 0) {
      return `${hours}小时`;
    }
    return `${mins}分钟`;
  };

  const getTimeUntil = (dateString: string) => {
    const now = new Date();
    const start = new Date(dateString);
    const diff = start.getTime() - now.getTime();

    if (diff < 0) return '已开始';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}天${hours}小时后`;
    if (hours > 0) return `${hours}小时${minutes}分钟后`;
    return `${minutes}分钟后`;
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-xl border transition-colors hover:bg-muted/50',
        colors.border
      )}
    >
      <div className="flex items-center gap-4">
        <Badge className={cn(colors.bg, colors.text, 'border-0')}>
          {PLATFORM_LABELS[contest.platform]}
        </Badge>
        <div>
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            {contest.name}
          </a>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span>{formatDateTime(contest.startTime)}</span>
            <span>·</span>
            <span>{formatDuration(contest.duration)}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        {contest.status === 'ongoing' ? (
          <Badge className={cn(statusColors.bg, statusColors.text, 'border-0')}>
            进行中
          </Badge>
        ) : (
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            {getTimeUntil(contest.startTime)}
          </span>
        )}
      </div>
    </div>
  );
}
