'use client';

import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">CP</span>
      </div>
      <span className="font-semibold text-lg text-foreground">Tracker</span>
    </Link>
  );
}
