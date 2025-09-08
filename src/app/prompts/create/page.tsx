"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { categoryAPI, promptAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 카테고리 타입
interface Category {
  id: number;
  name: string;
  description: string;
}

// 폼 데이터 타입
interface PromptFormData {
  title: string;
  description: string;
  content: string;
  categoryId: number | null;
  tags: string[];
}

export default function CreatePromptPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState<PromptFormData>({
    title: "",
    description: "",
    content: "",
    categoryId: null,
    tags: []
  });

  const [tagInput, setTagInput] = useState("");

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isAuthenticated) return;
      
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) return;

        const token = JSON.parse(authStorage).state?.accessToken;
        if (!token) return;

        const categoriesData = await categoryAPI.getCategories(token);
        setCategories(categoriesData);
      } catch (err) {
        console.error('카테고리를 가져오는데 실패했습니다:', err);
      }
    };

    fetchCategories();
  }, [isAuthenticated]);

  // 입력 핸들러
  const handleInputChange = (field: keyof PromptFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // 태그 제거
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      setError("제목, 내용, 카테고리는 필수 입력 항목입니다.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        router.push("/login");
        return;
      }

      const token = JSON.parse(authStorage).state?.accessToken;
      if (!token) {
        router.push("/login");
        return;
      }

      await promptAPI.createPrompt({
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        categoryId: formData.categoryId,
        tags: formData.tags
      }, token);

      // 성공 시 프롬프트 목록으로 리다이렉트
      router.push("/prompts");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '프롬프트 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // 로그인 체크 중
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* 헤더 */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            PromptHub
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/prompts" 
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              프롬프트 목록
            </Link>
            
            {isAuthenticated && user ? (
              // 로그인된 상태
              <>
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
              <Link 
                href="/login" 
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            프롬프트 작성
          </h1>
          <p className="text-gray-300">
            새로운 AI 프롬프트를 작성하고 커뮤니티와 공유해보세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* 프롬프트 작성 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <label className="block text-white text-lg font-semibold mb-3">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="프롬프트 제목을 입력하세요"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              maxLength={100}
            />
          </div>

          {/* 설명 */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <label className="block text-white text-lg font-semibold mb-3">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="프롬프트에 대한 간단한 설명을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              maxLength={500}
            />
          </div>

          {/* 카테고리 선택 */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <label className="block text-white text-lg font-semibold mb-3">
              카테고리 *
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleInputChange('categoryId', category.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    formData.categoryId === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 프롬프트 내용 */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <label className="block text-white text-lg font-semibold mb-3">
              프롬프트 내용 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="실제 AI에게 전달할 프롬프트 내용을 입력하세요"
              rows={10}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-mono"
            />
          </div>

          {/* 태그 */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <label className="block text-white text-lg font-semibold mb-3">
              태그 (선택사항)
            </label>
            
            {/* 태그 입력 */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그를 입력하세요"
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                추가
              </button>
            </div>

            {/* 태그 목록 */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-purple-400 hover:text-purple-200 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/prompts"
              className="px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "작성 중..." : "프롬프트 작성"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}