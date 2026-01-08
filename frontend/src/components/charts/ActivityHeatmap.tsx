'use client';

import { ActivityCalendar } from 'react-activity-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DailyActivity } from '@/types';

interface ActivityHeatmapProps {
  data: DailyActivity[];
  isLoading?: boolean;
}

/**
 * 填充365天连续日期数据
 * react-activity-calendar 需要连续的日期数据才能正确显示热力图
 */
function fillDateRange(data: DailyActivity[], days = 365): DailyActivity[] {
  const dataMap = new Map(data.map((item) => [item.date, item.count]));
  const result: DailyActivity[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: dataMap.get(dateStr) || 0,
    });
  }

  return result;
}

function transformData(data: DailyActivity[]) {
  // 先填充365天连续日期
  const filledData = fillDateRange(data, 365);

  return filledData.map((item) => {
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

  // 即使没有数据也显示365天的空热力图
  const activities = transformData(data || []);
  const total = (data || []).reduce((sum, item) => sum + item.count, 0);
  const activeDays = (data || []).filter((item) => item.count > 0).length;

  return (
    <Card className="rounded-2xl shadow-apple">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>提交热力图</CardTitle>
        <span className="text-sm text-muted-foreground">
          {total} 次提交, {activeDays} 天活跃
        </span>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <ActivityCalendar
          data={activities}
          blockSize={12}
          blockMargin={3}
          blockRadius={2}
          fontSize={12}
          showWeekdayLabels
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
          labels={{
            totalCount: '过去一年共 {{count}} 次提交',
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            weekdays: ['日', '一', '二', '三', '四', '五', '六'],
          }}
        />
      </CardContent>
    </Card>
  );
}
