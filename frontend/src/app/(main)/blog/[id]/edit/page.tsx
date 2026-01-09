'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { blogApi } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { UpdateBlogRequest } from '@/types';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const blogId = parseInt(id, 10);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', blogId, 'edit'],
    queryFn: () => blogApi.getBlogById(blogId),
    enabled: !isNaN(blogId),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateBlogRequest) => blogApi.updateBlog(blogId, data),
    onSuccess: () => {
      router.push(`/blog/my`);
    },
    onError: (error) => {
      alert('保存失败，请重试');
      console.error(error);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center py-24">
            <p className="text-orange-600/70 dark:text-orange-400/70">
              博客不存在
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 检查是否是作者
  if (blog.authorId !== user?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center py-24">
            <p className="text-orange-600/70 dark:text-orange-400/70">
              无权编辑此博客
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 检查状态
  if (blog.status !== 'DRAFT' && blog.status !== 'REJECTED') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center py-24">
            <p className="text-orange-600/70 dark:text-orange-400/70">
              当前状态不允许编辑
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
      <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/blog/my">
          <Button
            variant="ghost"
            className="mb-8 text-pink-600 hover:text-pink-700 hover:bg-pink-100 dark:text-pink-400 dark:hover:bg-pink-950"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回我的博客
          </Button>
        </Link>

        <BlogEditor
          mode="edit"
          initialData={blog}
          onSubmit={async (data) => {
            await updateMutation.mutateAsync(data as UpdateBlogRequest);
          }}
          onCancel={() => router.push('/blog/my')}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
