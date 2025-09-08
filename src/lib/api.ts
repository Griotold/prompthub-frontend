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
};