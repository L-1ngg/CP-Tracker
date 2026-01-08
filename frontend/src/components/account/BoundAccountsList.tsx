'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { crawlerApi } from '@/lib/api';
import { toast } from 'sonner';
import type { UserHandle } from '@/types';

interface BoundAccountsListProps {
  handles: UserHandle[];
  isLoading: boolean;
  userId: number;
}

const PLATFORM_URLS: Record<string, string> = {
  CODEFORCES: 'https://codeforces.com/profile/',
  ATCODER: 'https://atcoder.jp/users/',
  NOWCODER: 'https://ac.nowcoder.com/acm/contest/profile/',
};

export function BoundAccountsList({
  handles,
  isLoading,
  userId,
}: BoundAccountsListProps) {
  const queryClient = useQueryClient();

  const unbindMutation = useMutation({
    mutationFn: (platform: string) => crawlerApi.unbindHandle(userId, platform),
    onSuccess: () => {
      toast.success('解绑成功');
      queryClient.invalidateQueries({ queryKey: ['handles', userId] });
    },
    onError: () => {
      toast.error('解绑失败');
    },
  });

  const syncMutation = useMutation({
    mutationFn: () => crawlerApi.syncUser(userId),
    onSuccess: () => {
      toast.success('同步成功', {
        description: '数据已更新',
      });
      // 刷新所有相关数据
      queryClient.invalidateQueries({ queryKey: ['handles', userId] });
      queryClient.invalidateQueries({ queryKey: ['rating', userId] });
      queryClient.invalidateQueries({ queryKey: ['skills', userId] });
      queryClient.invalidateQueries({ queryKey: ['heatmap', userId] });
    },
    onError: () => {
      toast.error('同步失败');
    },
  });

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-apple">
        <CardHeader>
          <CardTitle>已绑定账号</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!handles || handles.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-2xl shadow-apple">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>已绑定账号</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="rounded-xl"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          同步数据
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {handles.map((handle) => (
            <div
              key={`${handle.platform}-${handle.handle}`}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="rounded-lg">
                  {handle.platform}
                </Badge>
                <div>
                  <a
                    href={`${PLATFORM_URLS[handle.platform] || '#'}${handle.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline flex items-center gap-1"
                  >
                    {handle.handle}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {handle.rating && (
                    <p className="text-sm text-muted-foreground">
                      Rating: {handle.rating}
                      {handle.maxRating && ` (Max: ${handle.maxRating})`}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => unbindMutation.mutate(handle.platform)}
                disabled={unbindMutation.isPending}
                className="text-destructive hover:text-destructive rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
