'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from '@/types';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />,
});

interface BlogEditorProps {
  initialData?: Blog;
  onSubmit: (data: CreateBlogRequest | UpdateBlogRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

export function BlogEditor({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode,
}: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '');

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }
    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    await onSubmit({
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      coverUrl: coverUrl.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-apple border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            {mode === 'create' ? '创建新博客' : '编辑博客'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 标题 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-pink-700 dark:text-pink-300">
              标题
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入博客标题"
              className="border-pink-200 dark:border-pink-800 focus:border-orange-400"
              maxLength={200}
            />
          </div>

          {/* 摘要 */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-pink-700 dark:text-pink-300">
              摘要
            </Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="请输入博客摘要（可选）"
              className="border-pink-200 dark:border-pink-800 focus:border-orange-400"
              maxLength={500}
            />
          </div>

          {/* 封面URL */}
          <div className="space-y-2">
            <Label htmlFor="coverUrl" className="text-pink-700 dark:text-pink-300">
              封面图片 URL
            </Label>
            <Input
              id="coverUrl"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="请输入封面图片 URL（可选）"
              className="border-pink-200 dark:border-pink-800 focus:border-orange-400"
            />
          </div>

          {/* Markdown 编辑器 */}
          <div className="space-y-2">
            <Label className="text-pink-700 dark:text-pink-300">内容</Label>
            <div data-color-mode="auto">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={400}
                preview="live"
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-pink-200 hover:bg-pink-50 dark:border-pink-800"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
            >
              {isSubmitting ? '保存中...' : '保存草稿'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
