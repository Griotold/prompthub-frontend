"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { authAPI, userAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const provider = params.provider as string;

      if (!code) {
        setStatus('error');
        return;
      }

      try {
        let response;
        
        switch (provider) {
          case 'google':
            response = await authAPI.googleLogin(code);
            break;
          case 'kakao':
            response = await authAPI.kakaoLogin(code);
            break;
          case 'naver':
            response = await authAPI.naverLogin(code);
            break;
          default:
            throw new Error('Unknown provider');
        }

        // 토큰으로 사용자 정보 가져오기
        const userProfile = await userAPI.getProfile(response.accessToken);

        // Zustand 스토어에 완전한 사용자 정보와 토큰 저장
        setAuth(userProfile, response.accessToken, response.refreshToken);

        setStatus('success');
        
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Login failed:', error);
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, params, router, setAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <div className="text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>로그인 처리 중...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-green-400">
            <p className="text-xl mb-2">✓ 로그인 성공!</p>
            <p>홈페이지로 이동 중...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-400">
            <p className="text-xl mb-2">✗ 로그인 실패</p>
            <button 
              onClick={() => router.push('/login')}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
}