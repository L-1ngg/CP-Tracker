'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Link2, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SkillRadar } from '@/components/charts/SkillRadar';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuthStore } from '@/stores';
import { analysisApi } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const userId = user?.id || 1;

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills', userId],
    queryFn: () => analysisApi.getSkills(userId),
    enabled: isAuthenticated,
  });

  const { data: heatmap, isLoading: heatmapLoading } = useQuery({
    queryKey: ['heatmap', userId],
    queryFn: () => analysisApi.getHeatmap(userId),
    enabled: isAuthenticated,
  });

  const { data: rating, isLoading: ratingLoading } = useQuery({
    queryKey: ['rating', userId],
    queryFn: () => analysisApi.getRating(userId),
    enabled: isAuthenticated,
  });

  // 判断是否有数据
  const hasData = !ratingLoading && rating && (
    rating.cfRating || rating.atRating || rating.nkRating
  );
  const isDataLoading = skillsLoading || heatmapLoading || ratingLoading;

  if (!isHydrated) {
    return (
      <div className="container py-8 px-4">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid gap-6">
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">
        欢迎回来，{user?.username}
      </h1>

      {/* 空状态提示 */}
      {!isDataLoading && !hasData && (
        <div className="mb-8">
          <EmptyState
            icon={Link2}
            title="暂无数据"
            description="您还没有绑定任何竞赛平台账号，绑定后即可查看您的竞赛数据和能力分析。"
          >
            <Button
              className="rounded-xl"
              onClick={() => alert('绑定账号功能开发中...')}
            >
              绑定平台账号
            </Button>
          </EmptyState>
        </div>
      )}

      {/* Rating Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <RatingCard
          title="统一 Rating"
          value={rating?.unifiedRating}
          isLoading={ratingLoading}
        />
        <RatingCard
          title="Codeforces"
          value={rating?.cfRating}
          isLoading={ratingLoading}
        />
        <RatingCard
          title="AtCoder"
          value={rating?.atRating}
          isLoading={ratingLoading}
        />
        <RatingCard
          title="NowCoder"
          value={rating?.nkRating}
          isLoading={ratingLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <SkillRadar data={skills || []} isLoading={skillsLoading} />
        <ActivityHeatmap data={heatmap || []} isLoading={heatmapLoading} />
      </div>
    </div>
  );
}

function RatingCard({
  title,
  value,
  isLoading,
}: {
  title: string;
  value?: number | null;
  isLoading: boolean;
}) {
  return (
    <Card className="rounded-2xl shadow-apple">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-2xl font-bold">
            {value ?? '-'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
