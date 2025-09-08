"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
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

        // 토큰 저장
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        setStatus('success');
        
        // 홈페이지로 리다이렉트
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Login failed:', error);
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, params, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <div className="text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Processing login...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-green-400">
            <p className="text-xl mb-2">✓ Login successful!</p>
            <p>Redirecting to homepage...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-400">
            <p className="text-xl mb-2">✗ Login failed</p>
            <button 
              onClick={() => router.push('/login')}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}