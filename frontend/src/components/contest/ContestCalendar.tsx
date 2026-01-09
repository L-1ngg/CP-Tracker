'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Contest } from '@/types';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '@/types';

interface ContestCalendarProps {
  contests: Contest[];
  className?: string;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
];

// 生成日期 key 的辅助函数（使用本地日期）
const getDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export function ContestCalendar({ contests, className }: ContestCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 获取当月第一天和最后一天
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }, [currentDate]);

  const lastDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  }, [currentDate]);

  // 生成日历网格
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return days;
  }, [firstDayOfMonth, lastDayOfMonth, currentDate]);

  // 按日期分组比赛
  const contestsByDate = useMemo(() => {
    const map = new Map<string, Contest[]>();
    contests.forEach((contest) => {
      const date = new Date(contest.startTime);
      const key = getDateKey(date);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(contest);
    });
    return map;
  }, [contests]);

  const getContestsForDate = useCallback((date: Date): Contest[] => {
    const key = getDateKey(date);
    return contestsByDate.get(key) || [];
  }, [contestsByDate]);

  const isToday = (date: Date): boolean => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
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

  return (
    <div className={cn('w-full relative', className)}>
      {/* 日历头部 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {currentDate.getFullYear()}年 {MONTHS[currentDate.getMonth()]}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center text-sm font-medium py-2',
              index === 0 || index === 6
                ? 'text-muted-foreground'
                : 'text-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="min-h-[100px]" />;
          }

          const dayContests = getContestsForDate(date);
          const isTodayDate = isToday(date);
          const isHovered = hoveredDate?.toISOString() === date.toISOString();

          return (
            <div
              key={date.toISOString()}
              className="relative min-h-[100px]"
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {/* 基础卡片 */}
              <div
                className={cn(
                  'absolute p-2 border rounded-xl cursor-pointer',
                  'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-left',
                  isTodayDate
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                    : 'border-border bg-background',
                  isHovered
                    ? 'z-30 shadow-2xl border-primary/50 ring-2 ring-primary/20 scale-[1.8]'
                    : 'z-10 hover:shadow-md inset-0 scale-100'
                )}
                style={isHovered ? {
                  top: 0,
                  left: 0,
                  width: '100%',
                  minHeight: '100%',
                  height: 'auto',
                } : undefined}
              >
                {/* 日期数字 */}
                <div
                  className={cn(
                    'text-sm font-medium mb-1.5 w-7 h-7 flex items-center justify-center rounded-full',
                    'transition-transform duration-300',
                    isTodayDate
                      ? 'bg-emerald-500 text-white'
                      : 'text-foreground',
                    isHovered && 'scale-90'
                  )}
                >
                  {date.getDate()}
                </div>

                {/* 比赛列表 */}
                <div className="space-y-1">
                  {isHovered ? (
                    // 悬浮时显示所有比赛的详细信息
                    dayContests.length > 0 ? (
                      dayContests.map((contest) => (
                        <div
                          key={contest.id}
                          className={cn(
                            'text-xs px-1.5 py-1 rounded-lg',
                            'transition-all duration-200',
                            PLATFORM_COLORS[contest.platform].bg,
                            PLATFORM_COLORS[contest.platform].text,
                            PLATFORM_COLORS[contest.platform].border,
                            'border'
                          )}
                        >
                          <div className="font-semibold truncate text-[10px] leading-tight mb-0.5">
                            {contest.name}
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-0.5 opacity-80 text-[9px]">
                              <Clock className="h-2 w-2" />
                              <span>{formatTime(contest.startTime)}</span>
                              <span>·</span>
                              <span>{formatDuration(contest.duration)}</span>
                            </div>
                            <a
                              href={contest.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={cn(
                                'flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-medium',
                                'bg-primary/90 text-primary-foreground hover:bg-primary transition-colors'
                              )}
                            >
                              前往
                              <ExternalLink className="h-2 w-2" />
                            </a>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 mb-1 opacity-50" />
                        <span className="text-[10px]">暂无比赛</span>
                      </div>
                    )
                  ) : (
                    // 默认显示简略信息
                    <>
                      {dayContests.slice(0, 2).map((contest) => (
                        <div
                          key={contest.id}
                          className={cn(
                            'text-xs px-1.5 py-0.5 rounded truncate',
                            PLATFORM_COLORS[contest.platform].bg,
                            PLATFORM_COLORS[contest.platform].text
                          )}
                        >
                          {contest.name}
                        </div>
                      ))}
                      {dayContests.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{dayContests.length - 2} 场比赛
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">今天</span>
        </div>
        {(['CODEFORCES', 'ATCODER', 'NOWCODER'] as const).map((platform) => (
          <div key={platform} className="flex items-center gap-2">
            <div
              className={cn(
                'w-3 h-3 rounded-sm',
                PLATFORM_COLORS[platform].bg,
                PLATFORM_COLORS[platform].border,
                'border'
              )}
            />
            <span className="text-sm text-muted-foreground">
              {PLATFORM_LABELS[platform]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
