'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Link2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SkillRadar } from '@/components/charts/SkillRadar';
import { ActivityHeatmap } from '@/components/charts/ActivityHeatmap';
import { EmptyState } from '@/components/common/EmptyState';
import { BindAccountDialog } from '@/components/account/BindAccountDialog';
import { BoundAccountsList } from '@/components/account/BoundAccountsList';
import { useAuthStore } from '@/stores';
import { analysisApi, crawlerApi } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const [bindDialogOpen, setBindDialogOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const userId = user?.id || 1;

  // 获取绑定的账号
  const { data: handles, isLoading: handlesLoading } = useQuery({
    queryKey: ['handles', userId],
    queryFn: () => crawlerApi.getHandles(userId),
    enabled: isAuthenticated,
  });

  const hasHandles = handles && handles.length > 0;

  // 只在有绑定账号时才查询 analysis 数据
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills', userId],
    queryFn: () => analysisApi.getSkills(userId),
    enabled: isAuthenticated && hasHandles,
  });

  const { data: heatmap, isLoading: heatmapLoading } = useQuery({
    queryKey: ['heatmap', userId],
    queryFn: () => analysisApi.getHeatmap(userId),
    enabled: isAuthenticated && hasHandles,
  });

  const { data: rating, isLoading: ratingLoading } = useQuery({
    queryKey: ['rating', userId],
    queryFn: () => analysisApi.getRating(userId),
    enabled: isAuthenticated && hasHandles,
  });

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
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          欢迎回来，{user?.username}
        </h1>
        <Button
          className="rounded-xl"
          onClick={() => setBindDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          绑定平台账号
        </Button>
      </div>

      {/* 空状态提示 - 未绑定账号时显示 */}
      {!handlesLoading && !hasHandles && (
        <div className="mb-8">
          <EmptyState
            icon={Link2}
            title="开始您的竞赛之旅"
            description="绑定您的竞赛平台账号，即可查看您的比赛数据、能力分析和提交记录。"
          >
            <Button
              className="rounded-xl"
              onClick={() => setBindDialogOpen(true)}
            >
              立即绑定账号
            </Button>
          </EmptyState>
        </div>
      )}

      {/* 已绑定账号时显示数据面板 */}
      {hasHandles && (
        <>
          {/* 已绑定账号列表 */}
          <div className="mb-8">
            <BoundAccountsList
              handles={handles || []}
              isLoading={handlesLoading}
              userId={userId}
            />
          </div>

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
        </>
      )}

      {/* 加载中状态 */}
      {handlesLoading && (
        <div className="space-y-6">
          <Skeleton className="h-[200px] rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      )}

      {/* 绑定账号对话框 */}
      <BindAccountDialog
        open={bindDialogOpen}
        onOpenChange={setBindDialogOpen}
        userId={userId}
      />
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
