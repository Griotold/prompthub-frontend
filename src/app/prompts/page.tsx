"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { categoryAPI, promptAPI } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  description: string;
}

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

      const data = await promptAPI.getPrompts({
        page,
        keyword,
        categoryId,
        token
      });

      console.log('프롬프트 API 응답:', data);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent flex-shrink-0">
            PromptHub
          </Link>
          
          <div className="flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated && user ? (
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
            ) : (
              <Link 
                href="/login" 
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>로그인</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-80px)]">
        <main className="max-w-6xl mx-auto px-8 py-8">
          {/* 상단 네비게이션 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:bg-gray-200 hover:text-pink-700 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                     홈으로 돌아가기
              </Link>
              <span className="text-black font-bold text-2xl">프롬프트 탐색</span>
            </div>

            {/* 보기 방식 버튼 - 오른쪽 끝으로 이동 */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* 검색창과 필터 영역 */}
          <div className="mb-8">
            {/* 검색창과 필터를 같은 줄에 배치 */}
            <div className="flex justify-between items-center gap-4">
              {/* 왼쪽: 검색창 */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="프롬프트 검색..."
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

              {/* 오른쪽: 필터 및 보기 옵션 */}
              <div className="flex items-center space-x-4">
                

                {/* 정렬 옵션 */}
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300">
                  <option>전체</option>
                  <option>최신순</option>
                  <option>인기순</option>
                </select>

                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300">
                  <option>인기순</option>
                  <option>최신순</option>
                  <option>좋아요순</option>
                </select>

                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span>필터</span>
                </button>
              </div>
            </div>
          </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">프롬프트를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 구분선 추가 */}
        <div className="border-t border-gray-200 mb-8"></div>

        {!loading && !error && (
            <>
                <div className="mb-8">
                  <div className="text-gray-700">
                    <span className="text-lg font-semibold">총 {pagination.totalCount ?? 0}개의 프롬프트를 찾았습니다</span>
                    {selectedCategory && (
                      <span className="ml-2 text-pink-600">
                        ({categories.find(c => c.id === selectedCategory)?.name} 카테고리)
                      </span>
                    )}
                  </div>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {prompts.map((prompt) => (
                        <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                            <article className="bg-white rounded-xl border border-pink-100 hover:border-pink-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-64 flex flex-col shadow-sm">
                                <div className="p-4 pb-2">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                                        {prompt.categoryName}
                                    </span>
                                </div>
                                
                                <div className="px-4 py-2 flex-1 flex items-center">
                                    <h2 className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-3 text-center w-full leading-relaxed">
                                        {prompt.title}
                                    </h2>
                                </div>
                                
                                <div className="p-4 pt-2 border-t border-pink-100">
                                    <div className="text-xs text-gray-500 mb-2">
                                        by {prompt.authorNickname}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
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
                ) : (
                  <div className="mb-16">
                    {prompts.map((prompt) => (
                      <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                        <article className="bg-white rounded-lg border border-pink-100 hover:border-pink-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group shadow-sm mb-6" style={{ padding: '19.2px 24px' }}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                                  {prompt.categoryName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  by {prompt.authorNickname}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(prompt.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              
                              <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors mb-2">
                                {prompt.title}
                              </h2>
                              
                              {prompt.description && (
                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                  {prompt.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-6 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  조회 {prompt.viewsCount > 999 ? `${(prompt.viewsCount / 1000).toFixed(1)}k` : prompt.viewsCount}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  좋아요 {prompt.likesCount > 999 ? `${(prompt.likesCount / 1000).toFixed(1)}k` : prompt.likesCount}
                                </span>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                    <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className="px-4 py-2 bg-white border border-pink-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors shadow-sm"
                    >
                    이전
                    </button>

                    {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 rounded-lg transition-colors shadow-sm ${
                        i === pagination.currentPage
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                            : 'bg-white border border-pink-200 text-gray-700 hover:bg-pink-50'
                        }`}
                    >
                        {i + 1}
                    </button>
                    ))}

                    <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= (pagination.totalPages || 1) - 1}
                    className="px-4 py-2 bg-white border border-pink-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors shadow-sm"
                    >
                    다음
                    </button>
                    </div>
                </div>
            </>
            )}
        </main>
      </div>
    </div>
  );
}