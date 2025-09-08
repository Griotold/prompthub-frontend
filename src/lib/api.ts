const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LoginRequest {
  authorizationCode: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export const authAPI = {
  // Google 로그인
  googleLogin: async (authorizationCode: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorizationCode }),
    });

    if (!response.ok) {
      throw new Error('Google login failed');
    }

    const data = await response.json();
    return data.data;
  },


  // Kakao 로그인
  kakaoLogin: async (authorizationCode: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/kakao/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorizationCode }),
    });

    if (!response.ok) {
      throw new Error('Kakao login failed');
    }

    const data = await response.json();
    return data.data;
  },

  // Naver 로그인
  naverLogin: async (authorizationCode: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/naver/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorizationCode }),
    });

    if (!response.ok) {
      throw new Error('Naver login failed');
    }

    const data = await response.json();
    return data.data;
  },
}

// 현재 사용자 정보 조회
export const userAPI = {
  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/members/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    const data = await response.json();
    return data.data;
  },

}

// 카테고리 목록 조회
export const categoryAPI = {
  getCategories: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get categories');
    }

    const data = await response.json();
    return data.data;
  },
};

// 프롬프트 관련 API
export const promptAPI = {
  // 프롬프트 목록 조회
  getPrompts: async (params: {
    page?: number;
    size?: number;
    keyword?: string;
    categoryId?: number | null;
    sort?: string;
    token: string;
  }) => {
    const { page = 0, size = 20, keyword, categoryId, sort = "createdAt,DESC", token } = params;
    
    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort
    });

    if (keyword) searchParams.append("keyword", keyword);
    if (categoryId) searchParams.append("categoryId", categoryId.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/prompts?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get prompts');
    }

    const data = await response.json();
    return data.data;
  },

  // 프롬프트 상세 조회
  getPromptById: async (id: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/prompts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get prompt');
    }

    const data = await response.json();
    return data.data;
  },

  // 프롬프트 작성
  createPrompt: async (promptData: {
    title: string;
    description: string;
    content: string;
    categoryId: number;
    tags?: string[];
  }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/prompts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptData),
    });

    if (!response.ok) {
      throw new Error('Failed to create prompt');
    }

    const data = await response.json();
    return data.data;
  },
};