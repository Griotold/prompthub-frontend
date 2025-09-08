import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { userAPI } from '@/lib/api';

export const useAuth = () => {
  const { 
    user, 
    accessToken, 
    isLoading, 
    setUser, 
    setLoading, 
    logout 
  } = useAuthStore();

  // 앱 시작 시 토큰으로 사용자 정보 가져오기
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken && !user) {
        setLoading(true);
        try {
          const userProfile = await userAPI.getProfile(accessToken);
          setUser(userProfile);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          logout(); // 토큰이 유효하지 않으면 로그아웃
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [accessToken, user, setUser, setLoading, logout]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
  };
};