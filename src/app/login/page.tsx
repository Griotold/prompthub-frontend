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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      {/* 카드 컨테이너 */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
              PromptHub
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Create account</h2>
          <p className="text-gray-600">Join 350,000+ AI enthusiasts and creators</p>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-200 text-gray-800 py-4 px-4 rounded-full font-medium hover:border-pink-200 hover:bg-pink-50 transition-all shadow-sm flex items-center justify-center gap-3"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            onClick={handleNaverLogin}
            className="w-full bg-[#03C75A] text-white py-4 px-4 rounded-full font-medium hover:bg-[#02B351] transition-colors shadow-sm flex items-center justify-center gap-3"
          >
            <SiNaver size={20} />
            Continue with Naver
          </button>

          <button
            onClick={handleKakaoLogin}
            className="w-full bg-[#FEE500] text-black py-4 px-4 rounded-full font-medium hover:bg-[#FDDC00] transition-colors shadow-sm flex items-center justify-center gap-3"
          >
            <RiKakaoTalkFill size={20} />
            Continue with Kakao
          </button>
        </div>

        {/* 하단 링크 */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-pink-500 hover:text-pink-600 underline transition-colors">
              terms of service
            </a>
          </p>
          <a href="#" className="text-pink-500 hover:text-pink-600 underline text-sm transition-colors">
            I already have an account
          </a>
        </div>
      </div>
    </div>
  );
}