"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      router.push(`/prompts?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      router.push('/prompts');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 헤더 */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex-shrink-0">
            PromptHub
          </div>
          
          {/* 중앙 검색바 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="프롬프트 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 네비게이션 (데스크톱) */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/prompts" className="text-gray-300 hover:text-cyan-400 transition-colors">
              프롬프트 탐색
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-cyan-400 transition-colors">
              카테고리
            </Link>
            <Link href="/popular" className="text-gray-300 hover:text-cyan-400 transition-colors">
              인기 프롬프트
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated && user ? (
              // 로그인된 상태
              <>
                <Link 
                  href="/prompts/create" 
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  프롬프트 작성
                </Link>
                
                {/* 사용자 드롭다운 */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.nickname ? user.nickname[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm">{user.nickname || '사용자'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* 드롭다운 메뉴 */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        프로필
                      </Link>
                      <Link 
                        href="/prompts/my" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        내 프롬프트
                      </Link>
                      <Link 
                        href="/prompts/liked" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        좋아요한 프롬프트
                      </Link>
                      <div className="border-t border-slate-700 my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                      >
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 로그인되지 않은 상태
              <>
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link 
                  href="/prompts/create" 
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  프롬프트 작성
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 나머지 메인 컨텐츠는 그대로 유지 */}
      <main className="relative">
        {/* 기존 메인 섹션들... */}
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              AI 프롬프트
            </span>
            <br />
            <span className="text-white">공유 플랫폼</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            ChatGPT, Claude, Midjourney를 위한 최고의 프롬프트를 발견하고 공유하세요. 
            실시간 프롬프트 분석과 스마트 추천으로 AI 활용 효율을 극대화하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/prompts"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              프롬프트 탐색하기
            </Link>
            {!isAuthenticated && (
              <Link 
                href="/login"
                className="px-8 py-4 border border-cyan-400 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-colors"
              >
                무료로 시작하기
              </Link>
            )}
          </div>
        </div>

        {/* 기존 기능 소개 섹션과 통계 섹션들... */}
      </main>
    </div>
  );
}