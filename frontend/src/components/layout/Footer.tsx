'use client';

import Link from 'next/link';
import { Logo } from '@/components/common/Logo';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              算法竞赛数据聚合与分析平台
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">平台</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contests" className="hover:text-primary">比赛日历</Link></li>
              <li><Link href="/problems" className="hover:text-primary">题库</Link></li>
              <li><Link href="/blog" className="hover:text-primary">博客</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">支持平台</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Codeforces</li>
              <li>AtCoder</li>
              <li>NowCoder</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">关于</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">关于我们</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">隐私政策</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CP-Tracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
