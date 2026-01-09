'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Eye, Calendar, ChevronLeft, ChevronRight, BookOpen, PenSquare, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { blogApi } from '@/lib/api';
import { useAuthStore } from '@/stores';
import type { Blog } from '@/types';

// 模拟博客数据
const mockBlogs: Blog[] = [
  {
    id: 1,
    authorId: 1,
    title: 'Codeforces 入门指南：从零开始的竞赛之路',
    summary: '本文将带你了解 Codeforces 平台的基本使用方法，包括如何注册、参加比赛、查看题解，以及一些新手常见问题的解答。',
    content: '# Codeforces 入门指南\n\n## 什么是 Codeforces？\n\nCodeforces 是全球最大的算法竞赛平台之一...',
    coverUrl: null,
    status: 'PUBLISHED',
    viewCount: 1024,
    likeCount: 88,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    publishedAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 2,
    authorId: 1,
    title: '动态规划专题总结：从入门到进阶',
    summary: '动态规划是算法竞赛中最重要的技巧之一。本文总结了 DP 的核心思想、常见模型和优化技巧，配合经典例题讲解。',
    content: '# 动态规划专题总结\n\n## 什么是动态规划？\n\n动态规划（Dynamic Programming）是一种...',
    coverUrl: null,
    status: 'PUBLISHED',
    viewCount: 2048,
    likeCount: 156,
    createdAt: '2024-11-28T14:30:00Z',
    updatedAt: '2024-11-28T14:30:00Z',
    publishedAt: '2024-11-28T14:30:00Z',
  },
  {
    id: 3,
    authorId: 2,
    title: '图论算法入门：DFS、BFS 与最短路',
    summary: '图论是算法竞赛的重要组成部分。本文介绍图的基本概念、存储方式，以及 DFS、BFS、Dijkstra 等经典算法。',
    content: '# 图论算法入门\n\n## 图的基本概念\n\n图由顶点和边组成...',
    coverUrl: null,
    status: 'PUBLISHED',
    viewCount: 1536,
    likeCount: 112,
    createdAt: '2024-11-25T09:15:00Z',
    updatedAt: '2024-11-25T09:15:00Z',
    publishedAt: '2024-11-25T09:15:00Z',
  },
  {
    id: 4,
    authorId: 2,
    title: '如何准备 ICPC 区域赛？一份完整的备赛指南',
    summary: '分享我们队伍备战 ICPC 区域赛的经验，包括团队配合、训练计划、比赛策略等方面的心得体会。',
    content: '# ICPC 区域赛备赛指南\n\n## 团队组建\n\n一个好的团队是成功的基础...',
    coverUrl: null,
    status: 'PUBLISHED',
    viewCount: 3072,
    likeCount: 234,
    createdAt: '2024-11-20T16:45:00Z',
    updatedAt: '2024-11-20T16:45:00Z',
    publishedAt: '2024-11-20T16:45:00Z',
  },
  {
    id: 5,
    authorId: 3,
    title: '数据结构进阶：线段树从入门到精通',
    summary: '线段树是处理区间问题的利器。本文详细讲解线段树的原理、实现、懒标记优化，以及常见的变体和应用。',
    content: '# 线段树从入门到精通\n\n## 什么是线段树？\n\n线段树是一种二叉树结构...',
    coverUrl: null,
    status: 'PUBLISHED',
    viewCount: 1792,
    likeCount: 145,
    createdAt: '2024-11-15T11:20:00Z',
    updatedAt: '2024-11-15T11:20:00Z',
    publishedAt: '2024-11-15T11:20:00Z',
  },
  {
    id: 6,
    authorId: 3,
    title: 'AtCoder 比赛技巧分享：如何稳定上分',
    summary: 'AtCoder 的题目风格与 Codeforces 有所不同。本文分享在 AtCoder 比赛中的一些实用技巧和注意事项。',
    content: '# AtCoder 比赛技巧\n\n## AtCoder 与 Codeforces 的区别\n\nAtCoder 的题目更注重思维...',
    coverUrl: null,
    status: 'PUBLISHED',
    viewCount: 896,
    likeCount: 67,
    createdAt: '2024-11-10T08:00:00Z',
    updatedAt: '2024-11-10T08:00:00Z',
    publishedAt: '2024-11-10T08:00:00Z',
  },
];

export default function BlogPage() {
  const [page, setPage] = useState(0);
  const pageSize = 9;
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => blogApi.getBlogs(page, pageSize),
  });

  // 如果 API 返回空数据，使用模拟数据
  const blogs = (data?.content && data.content.length > 0) ? data.content : mockBlogs;
  const totalPages = data?.totalPages || 1;
  const useMockData = !data?.content || data.content.length === 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未发布';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/20 dark:via-orange-950/20 dark:to-amber-950/20">
      <div className="container py-8 px-4 md:px-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              博客
            </h1>
            <p className="text-orange-600/70 dark:text-orange-400/70 mt-1">
              分享算法竞赛心得与技术文章
            </p>
          </div>
          {isAuthenticated && (
            <div className="flex gap-3">
              <Link href="/blog/my">
                <Button variant="outline" className="border-pink-200 hover:bg-pink-50 hover:text-pink-600 dark:border-pink-800 dark:hover:bg-pink-950">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  我的博客
                </Button>
              </Link>
              <Link href="/blog/new">
                <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                  <PenSquare className="h-4 w-4 mr-2" />
                  写博客
                </Button>
              </Link>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-2xl bg-pink-100/50 dark:bg-pink-900/20" />
            ))}
          </div>
        ) : (
          <>
            {/* 示例数据提示 */}
            {useMockData && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 border border-pink-200 dark:border-pink-800">
                <p className="text-sm text-pink-700 dark:text-pink-300">
                  以下是示例博客文章，实际内容将在后端服务启动后显示。
                </p>
              </div>
            )}

            {/* 博客卡片网格 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} formatDate={formatDate} useMockData={useMockData} />
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && !useMockData && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="border-pink-200 hover:bg-pink-50 hover:text-pink-600 dark:border-pink-800 dark:hover:bg-pink-950"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
                <span className="text-sm text-orange-600/70 dark:text-orange-400/70 px-4">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-800 dark:hover:bg-orange-950"
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BlogCard({
  blog,
  formatDate,
  useMockData,
}: {
  blog: Blog;
  formatDate: (date: string | null) => string;
  useMockData: boolean;
}) {
  // 模拟数据时不跳转到详情页
  const CardWrapper = useMockData ? 'div' : Link;
  const cardProps = useMockData ? {} : { href: `/blog/${blog.id}` };

  return (
    <CardWrapper {...cardProps as any}>
      <Card className="rounded-2xl shadow-apple hover:shadow-xl transition-all duration-300 h-full overflow-hidden border-pink-100 dark:border-pink-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-1 cursor-pointer">
        <div className="h-40 w-full bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-pink-300 dark:text-pink-700" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {blog.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {blog.summary}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-pink-500 dark:text-pink-400">
              <Calendar className="h-3 w-3" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-1 text-orange-500 dark:text-orange-400">
              <Eye className="h-3 w-3" />
              {blog.viewCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
