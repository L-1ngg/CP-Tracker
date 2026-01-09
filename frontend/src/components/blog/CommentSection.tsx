'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { blogApi } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { BlogComment } from '@/types';

interface CommentSectionProps {
  blogId: number;
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => blogApi.getComments(blogId),
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => blogApi.createComment(blogId, { content }),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => blogApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
    },
  });

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    createMutation.mutate(newComment.trim());
  };

  const comments = data?.content || [];

  return (
    <Card className="rounded-2xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-pink-700 dark:text-pink-300">
          <MessageCircle className="h-5 w-5" />
          评论 ({data?.totalElements || 0})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 发表评论 */}
        {isAuthenticated ? (
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              className="flex-1 min-h-[80px] p-3 rounded-xl border border-pink-200 dark:border-pink-800 bg-white dark:bg-gray-800 resize-none focus:outline-none focus:border-orange-400"
              maxLength={2000}
            />
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || createMutation.isPending}
              className="bg-gradient-to-r from-pink-500 to-orange-500 self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            请<a href="/login" className="text-pink-500 hover:underline mx-1">登录</a>后发表评论
          </p>
        )}

        {/* 评论列表 */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl bg-pink-100/50" />
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onDelete={(id) => deleteMutation.mutate(id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            暂无评论，快来抢沙发吧
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
  isDeleting,
}: {
  comment: BlogComment;
  currentUserId?: number;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = currentUserId === comment.userId;

  return (
    <div className="p-4 rounded-xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-pink-700 dark:text-pink-300">
              用户 #{comment.userId}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        </div>
        {isAuthor && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
