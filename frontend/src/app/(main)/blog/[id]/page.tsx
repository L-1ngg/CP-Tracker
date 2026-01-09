'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Eye, BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LikeButton } from '@/components/blog/LikeButton';
import { CommentSection } from '@/components/blog/CommentSection';
import { blogApi } from '@/lib/api';

const MDPreview = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full bg-pink-100/50 dark:bg-pink-900/20" />,
});

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = use(params);
  const blogId = parseInt(id, 10);

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogApi.getBlogById(blogId),
    enabled: !isNaN(blogId),
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未发布';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8 bg-pink-100/50 dark:bg-pink-900/20" />
          <Skeleton className="h-12 w-3/4 mb-4 bg-pink-100/50 dark:bg-pink-900/20" />
          <Skeleton className="h-6 w-1/2 mb-8 bg-orange-100/50 dark:bg-orange-900/20" />
          <Skeleton className="h-64 w-full mb-8 bg-pink-100/50 dark:bg-pink-900/20" />
          <Skeleton className="h-96 w-full bg-orange-100/50 dark:bg-orange-900/20" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 text-pink-600 hover:text-pink-700 hover:bg-pink-100 dark:text-pink-400 dark:hover:bg-pink-950">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回博客列表
            </Button>
          </Link>
          <Card className="rounded-2xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <BookOpen className="h-16 w-16 text-pink-300 dark:text-pink-700 mb-6" />
              <p className="text-orange-600/70 dark:text-orange-400/70 text-center">
                博客文章不存在或已被删除
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
      <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 text-pink-600 hover:text-pink-700 hover:bg-pink-100 dark:text-pink-400 dark:hover:bg-pink-950">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回博客列表
          </Button>
        </Link>

        {/* 文章卡片 */}
        <Card className="rounded-2xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur overflow-hidden">
          {/* 封面图 */}
          {blog.coverUrl ? (
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={blog.coverUrl}
                alt={blog.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent" />
            </div>
          ) : (
            <div className="h-32 w-full bg-gradient-to-r from-pink-200 via-orange-200 to-amber-200 dark:from-pink-900/50 dark:via-orange-900/50 dark:to-amber-900/50" />
          )}

          <div className="p-6 md:p-10">
            {/* 标题与元信息 */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-pink-500 dark:text-pink-400">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="flex items-center gap-1 text-orange-500 dark:text-orange-400">
                  <Eye className="h-4 w-4" />
                  {blog.viewCount} 次阅读
                </span>
                <LikeButton blogId={blogId} initialLikeCount={blog.likeCount} />
              </div>
            </header>

            {/* 摘要 */}
            {blog.summary && (
              <p className="text-lg text-orange-600/70 dark:text-orange-400/70 mb-8 pb-8 border-b border-pink-100 dark:border-pink-900">
                {blog.summary}
              </p>
            )}

            {/* 正文内容 */}
            <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-pink-700 dark:prose-headings:text-pink-300 prose-a:text-orange-600 dark:prose-a:text-orange-400" data-color-mode="auto">
              <MDPreview source={blog.content} />
            </article>
          </div>
        </Card>

        {/* 评论区 */}
        <CommentSection blogId={blogId} />
      </div>
    </div>
  );
}
