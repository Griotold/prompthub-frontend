export const oauthConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirectUri: `${window.location.origin}/auth/callback/google`,
    scope: 'openid email profile',
  },
  kakao: {
    clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
    redirectUri: `${window.location.origin}/auth/callback/kakao`,
  },
  naver: {
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
    redirectUri: `${window.location.origin}/auth/callback/naver`,
  },
};

export const generateOAuthURL = {
  google: () => {
    const params = new URLSearchParams({
      client_id: oauthConfig.google.clientId,
      redirect_uri: oauthConfig.google.redirectUri,
      response_type: 'code',
      scope: oauthConfig.google.scope,
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/oauth/authorize?${params.toString()}`;
  },

  kakao: () => {
    const params = new URLSearchParams({
      client_id: oauthConfig.kakao.clientId,
      redirect_uri: oauthConfig.kakao.redirectUri,
      response_type: 'code',
    });
    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  },

  naver: () => {
    const params = new URLSearchParams({
      client_id: oauthConfig.naver.clientId,
      redirect_uri: oauthConfig.naver.redirectUri,
      response_type: 'code',
      state: Math.random().toString(36).substring(7), // CSRF 방지
    });
    return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
  },
};