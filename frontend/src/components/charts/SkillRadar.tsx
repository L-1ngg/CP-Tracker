'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { SkillRadar as SkillRadarType } from '@/types';

interface SkillRadarProps {
  data: SkillRadarType[];
  isLoading?: boolean;
}

const TAG_LABELS: Record<string, string> = {
  dp: '动态规划',
  graphs: '图论',
  math: '数学',
  greedy: '贪心',
  'data structures': '数据结构',
  strings: '字符串',
  implementation: '实现',
  binary_search: '二分',
};

export function SkillRadar({ data, isLoading }: SkillRadarProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-apple">
        <CardHeader>
          <CardTitle>技能雷达图</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  // 处理空数据
  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl shadow-apple">
        <CardHeader>
          <CardTitle>技能雷达图</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">暂无技能数据</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    subject: TAG_LABELS[item.tag.toLowerCase()] || item.tag,
    value: item.rating,
    fullMark: 100,
    solvedCount: item.solvedCount,
  }));

  return (
    <Card className="rounded-2xl shadow-apple">
      <CardHeader>
        <CardTitle>技能雷达图</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="能力值"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
