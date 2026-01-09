'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Camera, Eye, EyeOff, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { usePasswordValidation, usePasswordMatch } from '@/hooks/usePasswordValidation';

export default function UserSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated } = useAuthStore();

  // 表单状态
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 密码验证
  const passwordValidation = usePasswordValidation(newPassword);
  const passwordMatch = usePasswordMatch(newPassword, confirmPassword);

  // 获取用户信息
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
  });

  // 当 profile 数据加载后，初始化表单
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  // 更新用户信息
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      toast.success('个人信息更新成功');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '更新失败');
    },
  });

  // 修改密码
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('密码修改成功');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '密码修改失败');
    },
  });

  // 上传头像
  const uploadAvatarMutation = useMutation({
    mutationFn: authApi.uploadAvatar,
    onSuccess: () => {
      toast.success('头像上传成功');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '头像上传失败');
    },
  });

  // 处理头像上传
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片大小不能超过5MB');
        return;
      }
      uploadAvatarMutation.mutate(file);
    }
  };

  // 处理保存个人信息
  const handleSaveProfile = () => {
    updateProfileMutation.mutate({ username, email });
  };

  // 处理修改密码
  const handleChangePassword = () => {
    if (!passwordValidation.isValid) {
      toast.error('密码不符合要求');
      return;
    }
    if (!passwordMatch.isMatching) {
      toast.error('两次输入的密码不一致');
      return;
    }
    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  // 判断修改密码按钮是否可用
  const canChangePassword =
    currentPassword.length > 0 &&
    passwordValidation.isValid &&
    passwordMatch.isMatching &&
    !changePasswordMutation.isPending;

  // 权限检查
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">请先登录</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md rounded-2xl shadow-apple-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">个人设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 头像区域 */}
          <div className="flex flex-col items-center">
            <div
              className="relative cursor-pointer group"
              onClick={handleAvatarClick}
            >
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatarUrl} />
                <AvatarFallback className="text-2xl">
                  {profile?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
              {uploadAvatarMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground mt-2">点击更换头像</p>
          </div>

          {/* 基本信息表单 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              className="w-full rounded-xl"
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              保存信息
            </Button>
          </div>

          {/* 分隔线 */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">修改密码</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">当前密码</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* 密码强度指示器 */}
                {newPassword.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={passwordValidation.strength}
                        className="h-1.5 flex-1"
                        indicatorClassName={passwordValidation.strengthColor}
                      />
                      <span className="text-xs text-muted-foreground min-w-[2rem]">
                        {passwordValidation.strengthLabel}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {passwordValidation.rules.slice(0, 3).map((rule) => (
                        <div
                          key={rule.id}
                          className={`flex items-center gap-1.5 text-xs ${
                            rule.passed ? 'text-green-600' : 'text-muted-foreground'
                          }`}
                        >
                          {rule.passed ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* 密码匹配状态 */}
                {passwordMatch.showStatus && (
                  <div
                    className={`flex items-center gap-1.5 text-xs ${
                      passwordMatch.isMatching ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {passwordMatch.isMatching ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>密码匹配</span>
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3" />
                        <span>密码不匹配</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={!canChangePassword}
                variant="outline"
                className="w-full rounded-xl"
              >
                {changePasswordMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                修改密码
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
