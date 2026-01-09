import { Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProblemsPage() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">题库</h1>
        <p className="text-muted-foreground mt-1">
          浏览和搜索 Codeforces、AtCoder、NowCoder 的题目
        </p>
      </div>

      <Card className="rounded-2xl shadow-apple">
        <CardContent className="flex flex-col items-center justify-center py-24">
          <Construction className="h-16 w-16 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-2">页面开发中</h2>
          <p className="text-muted-foreground text-center max-w-md">
            题库功能正在紧锣密鼓地开发中，敬请期待！
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
