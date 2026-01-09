'use client';

import { Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { blogApi } from '@/lib/api';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  blogId: number;
  initialLikeCount?: number;
}

export function LikeButton({ blogId, initialLikeCount = 0 }: LikeButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: likeStatus } = useQuery({
    queryKey: ['likeStatus', blogId],
    queryFn: () => blogApi.getLikeStatus(blogId),
    initialData: { hasLiked: false, likeCount: initialLikeCount },
  });

  const likeMutation = useMutation({
    mutationFn: () => blogApi.likeBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', blogId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => blogApi.unlikeBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likeStatus', blogId] });
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      alert('请先登录');
      return;
    }

    if (likeStatus?.hasLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const isLoading = likeMutation.isPending || unlikeMutation.isPending;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'gap-2 transition-colors',
        likeStatus?.hasLiked
          ? 'text-pink-500 hover:text-pink-600'
          : 'text-muted-foreground hover:text-pink-500'
      )}
    >
      <Heart
        className={cn('h-5 w-5', likeStatus?.hasLiked && 'fill-current')}
      />
      <span>{likeStatus?.likeCount || 0}</span>
    </Button>
  );
}
