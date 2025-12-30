import Link from 'next/link';
import { ArrowRight, BarChart3, Calendar, Code2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Calendar,
    title: '统一比赛日历',
    description: '聚合 Codeforces、AtCoder、NowCoder 等平台的比赛信息',
  },
  {
    icon: BarChart3,
    title: '能力画像',
    description: '雷达图展示各算法标签的能力值，直观了解自己的强弱项',
  },
  {
    icon: Code2,
    title: '训练分析',
    description: 'GitHub 风格热力图，记录每日刷题情况',
  },
  {
    icon: Trophy,
    title: '统一 Rating',
    description: '综合各平台分数，计算统一的竞赛能力评分',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            算法竞赛
            <span className="text-primary">数据聚合</span>
            平台
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            聚合 Codeforces、AtCoder、NowCoder 等平台数据，
            提供统一的比赛日历、能力画像和训练分析
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-xl px-8">
                开始使用
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contests">
              <Button size="lg" variant="outline" className="rounded-xl px-8">
                浏览比赛
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="rounded-2xl shadow-apple">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">准备好提升你的竞赛水平了吗？</h2>
          <p className="text-muted-foreground mb-8">
            立即注册，开始追踪你的竞赛数据
          </p>
          <Link href="/register">
            <Button size="lg" className="rounded-xl px-8">
              免费注册
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
