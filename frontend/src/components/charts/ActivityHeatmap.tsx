'use client';

import { ActivityCalendar } from 'react-activity-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DailyActivity } from '@/types';

interface ActivityHeatmapProps {
  data: DailyActivity[];
  isLoading?: boolean;
}

function transformData(data: DailyActivity[]) {
  return data.map((item) => {
    const count = item.count;
    let level: 0 | 1 | 2 | 3 | 4;
    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 5) level = 2;
    else if (count <= 10) level = 3;
    else level = 4;
    return { date: item.date, count: item.count, level };
  });
}

export function ActivityHeatmap({ data, isLoading }: ActivityHeatmapProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-apple">
        <CardHeader>
          <CardTitle>提交热力图</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[150px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  // 处理空数据
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl shadow-apple">
        <CardHeader>
          <CardTitle>提交热力图</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[150px]">
          <p className="text-sm text-muted-foreground">暂无提交记录</p>
        </CardContent>
      </Card>
    );
  }

  const activities = transformData(data);
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const activeDays = data.filter((item) => item.count > 0).length;

  return (
    <Card className="rounded-2xl shadow-apple">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>提交热力图</CardTitle>
        <span className="text-sm text-muted-foreground">
          {total} 次提交, {activeDays} 天活跃
        </span>
      </CardHeader>
      <CardContent>
        <ActivityCalendar
          data={activities}
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
          labels={{
            totalCount: '{{count}} 次提交',
          }}
        />
      </CardContent>
    </Card>
  );
}
