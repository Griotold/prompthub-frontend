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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-pink-100 text-center">
        {status === 'loading' && (
          <div className="text-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">로그인 처리 중...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-green-600">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-semibold mb-2">로그인 성공!</p>
            <p className="text-gray-600">홈페이지로 이동 중...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-xl font-semibold mb-2">로그인 실패</p>
            <button 
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full mt-4 hover:opacity-90 transition-opacity shadow-md"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );
}