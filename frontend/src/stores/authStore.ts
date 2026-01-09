import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { queryClient } from '@/providers/QueryProvider';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (token: string, user: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      logout: () => {
        // 清除 React Query 缓存，防止切换账号时显示旧数据
        queryClient.clear();
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'cp-tracker-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
