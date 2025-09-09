"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { categoryAPI, promptAPI } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// 카테고리 타입 추가
interface Category {
  id: number;
  name: string;
  description: string;
}

// 프롬프트 타입 정의
interface Prompt {
  id: number;
  title: string;
  description: string;
  categoryName: string;
  authorNickname: string;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
}

// 페이지네이션 정보
interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  size: number;
}

export default function PromptsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const searchParams = useSearchParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 0,
    totalPages: 1,
    totalCount: 0,
    size: 20
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // 카테고리 목록 가져오기
const fetchCategories = async () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      console.log('로그인이 필요합니다');
      return;
    }

    const token = JSON.parse(authStorage).state?.accessToken;
    if (!token) {
      console.log('토큰이 없습니다');
      return;
    }

    console.log('카테고리 API 호출 시작');
    const categoriesData = await categoryAPI.getCategories(token);
    console.log('카테고리 데이터:', categoriesData);
    setCategories(categoriesData);
  } catch (err) {
    console.error('카테고리를 가져오는데 실패했습니다:', err);
  }
};

  // 프롬프트 목록 가져오기
  // 기존 fetchPrompts 함수를 이렇게 수정
const fetchPrompts = async (page = 0, keyword = "", categoryId: number | null = null) => {
  try {
    setLoading(true);
    
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      console.log('로그인이 필요합니다');
      return;
    }

    const token = JSON.parse(authStorage).state?.accessToken;
    if (!token) {
      console.log('토큰이 없습니다');
      return;
    }

    // API 함수 사용
    const data = await promptAPI.getPrompts({
      page,
      keyword,
      categoryId,
      token
    });

    console.log('프롬프트 API 응답:', data); // 디버깅용

    setPrompts(data.content || []);
    setPagination({
        currentPage: data.pagination?.currentPage || 0,
        totalPages: data.pagination?.totalPages || 1,
        totalCount: data.pagination?.totalCount || 0,
        size: data.size || 20
    });


  } catch (err) {
    console.error('프롬프트 가져오기 실패:', err);
    setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
        if (isAuthenticated) {
            fetchCategories();
        }
        
        // URL 파라미터에서 검색어 가져오기
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setSearchKeyword(searchFromUrl);
            fetchPrompts(0, searchFromUrl, null);
        } else {
            fetchPrompts();
        }
    }, [isAuthenticated, searchParams]);

  const handleSearch = () => {
    fetchPrompts(0, searchKeyword, selectedCategory);
  };

  const handlePageChange = (newPage: number) => {
    fetchPrompts(newPage, searchKeyword, selectedCategory);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    fetchPrompts(0, searchKeyword, categoryId);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 헤더 */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex-shrink-0">
            PromptHub
          </Link>
          
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

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* 사이드바 */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 
          bg-slate-800 border-r border-slate-700
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto p-6">
            {/* 모바일 헤더 */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-white">필터</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 카테고리 섹션 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">카테고리</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  전체
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-medium">{category.name}</div>
                    {category.description && (
                      <div className="text-xs opacity-80 mt-1">{category.description}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 사이드바 오버레이 (모바일) */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* 메인 콘텐츠 */}
        <main className="flex-1 lg:ml-0 px-8 lg:px-12 py-8 max-w-[1600px] mx-auto">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                프롬프트 탐색
              </h1>
              <p className="text-gray-300">
                커뮤니티가 공유한 다양한 AI 프롬프트를 탐색하고 활용해보세요
              </p>
            </div>
            
            {/* 모바일 필터 버튼 */}
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              필터
            </button>
          </div>

        {/* 로딩, 에러, 프롬프트 목록 - 기존과 동일 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-300">프롬프트를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
            <>
                {/* 결과 정보 - 더 눈에 띄게 수정 */}
                <div className="max-w-7xl mx-auto mb-8">
                    <div className="px-4 py-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                            <span className="text-lg font-semibold">총 {pagination.totalCount ?? 0}개의 프롬프트</span>
                            {selectedCategory && (
                                <span className="ml-2 text-cyan-400">
                                ({categories.find(c => c.id === selectedCategory)?.name} 카테고리)
                                </span>
                            )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 프롬프트 카드 그리드 */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                {prompts.map((prompt) => (
                    <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                        <article className="bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-64 flex flex-col">
                            {/* 카드 상단: 카테고리 태그 */}
                            <div className="p-4 pb-2">
                                <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full">
                                    {prompt.categoryName}
                                </span>
                            </div>
                            
                            {/* 카드 중앙: 제목 */}
                            <div className="px-4 py-2 flex-1 flex items-center">
                                <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-3 text-center w-full leading-relaxed">
                                    {prompt.title}
                                </h2>
                            </div>
                            
                            {/* 카드 하단: 통계 정보 */}
                            <div className="p-4 pt-2 border-t border-slate-700/50">
                                <div className="text-xs text-gray-400 mb-2">
                                    by {prompt.authorNickname}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {prompt.viewsCount > 999 ? `${(prompt.viewsCount / 1000).toFixed(1)}k` : prompt.viewsCount}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {prompt.likesCount > 999 ? `${(prompt.likesCount / 1000).toFixed(1)}k` : prompt.likesCount}
                                        </span>
                                    </div>
                                    <div>
                                        {new Date(prompt.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
                    </div>
                </div>

                {/* 페이지네이션 - 항상 표시하도록 수정 */}
                <div className="max-w-7xl mx-auto px-4 mt-16">
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                        {/* 이전 버튼 */}
                        <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 0}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                        이전
                        </button>

                        {/* 페이지 번호 버튼들 */}
                        {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                            i === pagination.currentPage
                                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                                : 'bg-slate-800 text-white hover:bg-slate-700'
                            }`}
                        >
                            {i + 1}
                        </button>
                        ))}

                        {/* 다음 버튼 */}
                        <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= (pagination.totalPages || 1) - 1}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                        다음
                        </button>
                        </div>
                    </div>
                </div>
            </>
            )}
        </main>
      </div>
    </div>
  );
}