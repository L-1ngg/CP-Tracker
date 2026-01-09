'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 创建全局 QueryClient 实例，以便在登出时可以清除缓存
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
