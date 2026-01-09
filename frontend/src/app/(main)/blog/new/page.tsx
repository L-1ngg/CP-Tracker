'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlogEditor } from '@/components/blog/BlogEditor';
import { blogApi } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { CreateBlogRequest } from '@/types';

export default function NewBlogPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const createMutation = useMutation({
    mutationFn: (data: CreateBlogRequest) => blogApi.createBlog(data),
    onSuccess: (blog) => {
      router.push(`/blog/my`);
    },
    onError: (error) => {
      alert('创建失败，请重试');
      console.error(error);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
        <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center py-24">
            <p className="text-orange-600/70 dark:text-orange-400/70 mb-4">
              请先登录后再创建博客
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
      <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/blog">
          <Button
            variant="ghost"
            className="mb-8 text-pink-600 hover:text-pink-700 hover:bg-pink-100 dark:text-pink-400 dark:hover:bg-pink-950"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回博客列表
          </Button>
        </Link>

        <BlogEditor
          mode="create"
          onSubmit={async (data) => {
            await createMutation.mutateAsync(data as CreateBlogRequest);
          }}
          onCancel={() => router.push('/blog')}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}
