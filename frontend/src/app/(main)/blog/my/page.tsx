'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Edit, Trash2, Send, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { blogApi } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { Blog } from '@/types';

const STATUS_CONFIG = {
  DRAFT: { label: '草稿', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  PENDING: { label: '审核中', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  PUBLISHED: { label: '已发布', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  REJECTED: { label: '已拒绝', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
};

export default function MyBlogsPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['myBlogs', page],
    queryFn: () => blogApi.getMyBlogs(page, 10),
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (blogId: number) => blogApi.deleteBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBlogs'] });
    },
  });

  const submitMutation = useMutation({
    mutationFn: (blogId: number) => blogApi.submitBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBlogs'] });
    },
  });

  const handleDelete = (blogId: number, title: string) => {
    if (confirm(`确定要删除"${title}"吗？`)) {
      deleteMutation.mutate(blogId);
    }
  };

  const handleSubmit = (blogId: number) => {
    if (confirm('确定要提交审核吗？提交后将无法编辑。')) {
      submitMutation.mutate(blogId);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
      <div className="container py-8 px-4 md:px-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              我的博客
            </h1>
            <p className="text-orange-600/70 dark:text-orange-400/70 mt-1">
              管理你的博客文章
            </p>
          </div>
          <Link href="/blog/new">
            <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              写新博客
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-pink-100/50 dark:bg-pink-900/20" />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <BlogItem
                key={blog.id}
                blog={blog}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
                isDeleting={deleteMutation.isPending}
                isSubmitting={submitMutation.isPending}
              />
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
              <p className="text-orange-600/70 dark:text-orange-400/70 mb-4">
                你还没有写过博客
              </p>
              <Link href="/blog/new">
                <Button className="bg-gradient-to-r from-pink-500 to-orange-500">
                  <Plus className="h-4 w-4 mr-2" />
                  开始写作
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function BlogItem({
  blog,
  onDelete,
  onSubmit,
  isDeleting,
  isSubmitting,
}: {
  blog: Blog;
  onDelete: (id: number, title: string) => void;
  onSubmit: (id: number) => void;
  isDeleting: boolean;
  isSubmitting: boolean;
}) {
  const statusConfig = STATUS_CONFIG[blog.status];
  const canEdit = blog.status === 'DRAFT' || blog.status === 'REJECTED';
  const canSubmit = blog.status === 'DRAFT' || blog.status === 'REJECTED';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="rounded-xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium truncate">{blog.title}</h3>
              <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>创建于 {formatDate(blog.createdAt)}</span>
              {blog.status === 'PUBLISHED' && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {blog.viewCount}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {blog.status === 'PUBLISHED' && (
              <Link href={`/blog/${blog.id}`}>
                <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {canEdit && (
              <Link href={`/blog/${blog.id}/edit`}>
                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {canSubmit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSubmit(blog.id)}
                disabled={isSubmitting}
                className="text-green-600 hover:text-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(blog.id, blog.title)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
