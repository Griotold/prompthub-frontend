"use client";

import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { RiKakaoTalkFill } from "react-icons/ri";
import { generateOAuthURL } from "@/lib/oauth";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/callback/google&scope=openid%20email%20profile&response_type=code`;
    console.log("Google OAuth URL:", googleUrl);
    window.location.href = googleUrl;
  };

  const handleNaverLogin = () => {
    const naverUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/callback/naver&response_type=code&state=random_state`;
    console.log("Naver OAuth URL:", naverUrl);
    window.location.href = naverUrl;
  };

  const handleKakaoLogin = () => {
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=http://localhost:3000/auth/callback/kakao&response_type=code`;
    console.log("Kakao OAuth URL:", kakaoUrl);
    window.location.href = kakaoUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* 카드 컨테이너 */}
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-xl font-bold">PH</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Create account</h1>
          <p className="text-slate-400">Join 350,000+ AI enthusiasts and creators</p>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            onClick={handleNaverLogin}
            className="w-full bg-[#03C75A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#02B351] transition-colors flex items-center justify-center gap-3"
          >
            <SiNaver size={20} />
            Continue with Naver
          </button>

          <button
            onClick={handleKakaoLogin}
            className="w-full bg-[#FEE500] text-black py-3 px-4 rounded-lg font-medium hover:bg-[#FDDC00] transition-colors flex items-center justify-center gap-3"
          >
            <RiKakaoTalkFill size={20} />
            Continue with Kakao
          </button>
        </div>

        {/* 하단 링크 */}
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:underline">
              terms of service
            </a>
          </p>
          <a href="#" className="text-blue-400 hover:underline text-sm">
            I already have an account
          </a>
        </div>
      </div>
    </div>
  );
}