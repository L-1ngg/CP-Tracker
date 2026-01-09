'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores';

const registerSchema = z
  .object({
    username: z.string().min(3, '用户名至少3个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少6个字符'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      setAuth(response.token, {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
      });
      toast.success('注册成功');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error?.response?.data?.message || '注册失败，请稍后重试';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-apple-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">创建账户</CardTitle>
          <CardDescription>开始您的竞赛之旅</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入用户名"
                className="rounded-xl"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱"
                className="rounded-xl"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                className="rounded-xl"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                className="rounded-xl"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? '注册中...' : '注册'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            已有账户？{' '}
            <Link href="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
