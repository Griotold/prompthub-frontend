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
    <div className="min-h-screen">
      {/* ========== 헤더 영역 ========== */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        {/* 헤더 */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent flex-shrink-0">
              PromptHub
            </div>
            
            {/* 중앙 검색바 */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="원하는 프롬프트를 검색해보세요..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-pink-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 shadow-sm pr-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 flex-shrink-0">
              {isAuthenticated && user ? (
                // 로그인된 상태
                <>
                  {/* 사용자 드롭다운 */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {user.nickname ? user.nickname[0].toUpperCase() : 'U'}
                      </div>
                      <span className="text-sm">{user.nickname || '사용자'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* 드롭다운 메뉴 */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-100 py-2">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-gray-800 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          프로필
                        </Link>
                        <Link 
                          href="/prompts/my" 
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-gray-800 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          내 프롬프트
                        </Link>
                        <Link 
                          href="/prompts/liked" 
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-gray-800 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          좋아요한 프롬프트
                        </Link>
                        <div className="border-t border-pink-100 my-2"></div>
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-pink-50 transition-colors"
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
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>로그인</span>
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:opacity-90 transition-opacity shadow-md"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 히어로 섹션 */}
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              AI 프롬프트 공유의 새로운 기준
            </span>
          </h1>
          
          <h3 className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            검증된 프롬프트로 더 나은 AI 결과를 만들어보세요
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/prompts"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>프롬프트 탐색하기</span>
            </Link>
            <Link 
              href="/prompts/create"
              className="px-8 py-4 border-2 border-pink-300 text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>프롬프트 업로드하기</span>
            </Link>
          </div>

          {/* 통계 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">1,000+</div>
              <div className="text-gray-600">검증된 프롬프트</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">500+</div>
              <div className="text-gray-600">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">50+</div>
              <div className="text-gray-600">카테고리</div>
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200"></div>

      {/* ========== 인기 카테고리 섹션 (흰색 배경) ========== */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">인기 카테고리</h2>
            <p className="text-gray-600">다양한 분야의 검증된 프롬프트를 카테고리별로 탐색해보세요</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: '마케팅', 
                iconBg: 'bg-pink-500', 
                icon: '📢', 
                count: '150+',
                description: '광고 카피, SNS 콘텐츠, 브랜딩',
                likes: '1.2k',
                prompts: '89'
              },
              { 
                name: '개발', 
                iconBg: 'bg-blue-500', 
                icon: '</>', 
                count: '200+',
                description: '코드 생성, 디버깅, 기술 문서',
                likes: '1.2k',
                prompts: '89'
              },
              { 
                name: '디자인', 
                iconBg: 'bg-purple-500', 
                icon: '🎨', 
                count: '120+',
                description: 'UI/UX, 그래픽 디자인, 아이디어',
                likes: '1.2k',
                prompts: '89'
              },
              { 
                name: '글쓰기', 
                iconBg: 'bg-green-500', 
                icon: '✍️', 
                count: '180+',
                description: '블로그, 소설, 기사 작성',
                likes: '1.2k',
                prompts: '89'
              },
              { 
                name: '분석', 
                iconBg: 'bg-orange-500', 
                icon: '📊', 
                count: '90+',
                description: '데이터 분석, 리포트, 인사이트',
                likes: '1.2k',
                prompts: '89'
              },
              { 
                name: '비즈니스', 
                iconBg: 'bg-teal-500', 
                icon: '💼', 
                count: '110+',
                description: '전략, 기획, 프레젠테이션',
                likes: '1.2k',
                prompts: '89'
              }
            ].map((category, index) => (
              <Link
                key={index}
                href={`/categories/${category.name}`}
                className="p-6 bg-gray-50 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-pink-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${category.iconBg} rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                    {category.icon}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{category.count}</div>
                </div>
                
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{category.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{category.prompts}</span>
                    </div>
                  </div>
                  <div className="text-pink-500 text-sm font-medium group-hover:text-pink-600 transition-colors">
                    더 보기 →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}