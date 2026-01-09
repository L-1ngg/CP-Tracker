'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/common/Logo';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: '仪表盘' },
  { href: '/contests', label: '比赛' },
  { href: '/problems', label: '题库' },
  { href: '/blog', label: '博客' },
];

const adminNavItems = [
  { href: '/admin/blogs', label: '博客审核' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <>
                <span className="text-muted-foreground/50">|</span>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
                      pathname.startsWith('/admin')
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Shield className="h-3 w-3" />
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href={`/u/${user?.username}`}>
                <Button variant="ghost" className="rounded-xl">
                  {user?.username}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={logout}
              >
                退出
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl">
                  登录
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-xl">注册</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary p-2 rounded-xl',
                      pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <>
                    <div className="border-t pt-4 mt-2">
                      <span className="text-xs text-muted-foreground px-2">管理</span>
                    </div>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'text-lg font-medium transition-colors hover:text-primary p-2 rounded-xl flex items-center gap-2',
                          pathname.startsWith('/admin')
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground'
                        )}
                      >
                        <Shield className="h-4 w-4" />
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
                <div className="border-t pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link href={`/u/${user?.username}`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-xl"
                        >
                          {user?.username}
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full mt-2 rounded-xl"
                        onClick={logout}
                      >
                        退出
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-xl"
                        >
                          登录
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full mt-2 rounded-xl">
                          注册
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
