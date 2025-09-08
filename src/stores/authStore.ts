import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  nickname: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  
  // 액션들
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) => 
        set({ user, accessToken, refreshToken }),
      
      setUser: (user) => 
        set({ user }),
      
      logout: () => 
        set({ user: null, accessToken: null, refreshToken: null }),
      
      setLoading: (isLoading) => 
        set({ isLoading }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);