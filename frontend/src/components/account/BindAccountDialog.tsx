'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { crawlerApi } from '@/lib/api';
import { toast } from 'sonner';

interface BindAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

const PLATFORMS = [
  { value: 'CODEFORCES', label: 'Codeforces' },
  { value: 'ATCODER', label: 'AtCoder' },
  // { value: 'NOWCODER', label: 'NowCoder (牛客)' },  // 暂时禁用：牛客有反爬机制
];

export function BindAccountDialog({
  open,
  onOpenChange,
  userId,
}: BindAccountDialogProps) {
  const [platform, setPlatform] = useState('');
  const [handle, setHandle] = useState('');
  const queryClient = useQueryClient();

  const bindMutation = useMutation({
    mutationFn: () => crawlerApi.bindHandle(userId, { platform, handle }),
    onSuccess: (data) => {
      toast.success(`成功绑定 ${data.handle}`, {
        description: data.rating ? `Rating: ${data.rating}` : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['handles', userId] });
      onOpenChange(false);
      setPlatform('');
      setHandle('');
    },
    onError: (error: unknown) => {
      // 解析错误信息
      let message = '请检查账号是否正确';
      if (error && typeof error === 'object') {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        if (err.response?.data?.message) {
          message = err.response.data.message;
        } else if (err.message) {
          message = err.message;
        }
      }

      // 根据错误类型显示不同提示
      if (message.includes('已绑定')) {
        toast.error('该平台已绑定账号', {
          description: '每个平台只能绑定一个账号，请先解绑后再绑定新账号',
        });
      } else if (message.includes('不存在') || message.includes('无法访问')) {
        toast.error('账号不存在', {
          description: '请检查输入的账号名称是否正确',
        });
      } else {
        toast.error('绑定失败', {
          description: message,
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || !handle.trim()) {
      toast.error('请填写完整信息');
      return;
    }
    bindMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>绑定平台账号</DialogTitle>
          <DialogDescription>
            绑定您的竞赛平台账号，系统将自动同步您的比赛数据。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform">选择平台</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="选择竞赛平台" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="handle">账号 Handle</Label>
              <Input
                id="handle"
                placeholder="输入您的账号名称"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={bindMutation.isPending}
              className="rounded-xl"
            >
              {bindMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              绑定
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
