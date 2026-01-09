'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Eye, Calendar, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { blogApi } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { Blog } from '@/types';

export default function AdminBlogsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pendingBlogs', page],
    queryFn: () => blogApi.getPendingBlogs(page, 10),
    enabled: isAuthenticated,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ blogId, action, comment }: { blogId: number; action: 'APPROVE' | 'REJECT'; comment?: string }) =>
      blogApi.reviewBlog(blogId, action, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingBlogs'] });
      setReviewingId(null);
      setRejectComment('');
    },
    onError: (error) => {
      alert('操作失败，请重试');
      console.error(error);
    },
  });

  const handleApprove = (blogId: number) => {
    if (confirm('确定要通过这篇博客吗？')) {
      reviewMutation.mutate({ blogId, action: 'APPROVE' });
    }
  };

  const handleReject = (blogId: number) => {
    reviewMutation.mutate({ blogId, action: 'REJECT', comment: rejectComment || undefined });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6">
          <div className="text-center py-24">
            <p className="text-orange-600/70 dark:text-orange-400/70 mb-4">
              请先登录
            </p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-pink-500 to-orange-500">
                去登录
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const blogs = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
      <div className="container py-8 px-4 md:px-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              博客审核
            </h1>
          </div>
          <p className="text-orange-600/70 dark:text-orange-400/70">
            审核待发布的博客文章
          </p>
        </div>

        {/* 统计信息 */}
        <Card className="rounded-2xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur mb-6">
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="text-orange-600 dark:text-orange-400 font-medium">
                待审核博客: {totalElements} 篇
              </span>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl bg-pink-100/50 dark:bg-pink-900/20" />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="rounded-xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* 博客信息 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium mb-2 text-pink-700 dark:text-pink-300">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {blog.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(blog.createdAt)}
                        </span>
                        <Badge variant="outline" className="border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400">
                          作者 ID: {blog.authorId}
                        </Badge>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/blog/${blog.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="border-pink-200 dark:border-pink-800">
                          <Eye className="h-4 w-4 mr-1" />
                          预览
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(blog.id)}
                        disabled={reviewMutation.isPending}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        通过
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewingId(reviewingId === blog.id ? null : blog.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                      >
                        <X className="h-4 w-4 mr-1" />
                        拒绝
                      </Button>
                    </div>
                  </div>

                  {/* 拒绝原因输入框 */}
                  {reviewingId === blog.id && (
                    <div className="mt-4 pt-4 border-t border-pink-100 dark:border-pink-900">
                      <div className="flex gap-3">
                        <textarea
                          value={rejectComment}
                          onChange={(e) => setRejectComment(e.target.value)}
                          placeholder="请输入拒绝原因（可选）..."
                          className="flex-1 min-h-[80px] p-3 rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 resize-none focus:outline-none focus:border-red-400"
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReject(blog.id)}
                            disabled={reviewMutation.isPending}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            确认拒绝
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReviewingId(null);
                              setRejectComment('');
                            }}
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="border-pink-200 dark:border-pink-800"
                >
                  上一页
                </Button>
                <span className="px-4 py-2 text-sm text-orange-600/70">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="border-orange-200 dark:border-orange-800"
                >
                  下一页
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="rounded-2xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <Check className="h-16 w-16 text-green-300 dark:text-green-700 mb-6" />
              <p className="text-orange-600/70 dark:text-orange-400/70 text-center">
                暂无待审核的博客
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
