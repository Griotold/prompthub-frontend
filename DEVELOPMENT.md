# PromptHub 개발 진행 상황

## 프로젝트 개요
AI 프롬프트 공유 플랫폼 - ChatGPT, Claude, Midjourney 등을 위한 프롬프트 발견 및 공유

## 기술 스택
- **백엔드**: Spring Boot + JWT + OAuth2 (localhost:8080)
- **프론트엔드**: Next.js 15 + TypeScript + Tailwind CSS (localhost:3000)
- **상태관리**: Zustand (persist 미들웨어 사용)
- **인증**: Google/Kakao/Naver OAuth2

## 완료된 기능
- [x] Google OAuth2 소셜 로그인 구현
- [x] Zustand 기반 인증 상태 관리
- [x] 사용자 프로필 표시 (닉네임, 드롭다운 메뉴)
- [x] 로그인/로그아웃 UI 완성
- [x] 홈페이지 랜딩 UI (다크테마 + 보라-청록 그라데이션)

## 현재 프로젝트 구조
```
prompthub-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                              # 홈페이지 (완료)
│   │   ├── login/page.tsx                        # 로그인 페이지 (완료)
│   │   └── auth/callback/[provider]/page.tsx     # OAuth 콜백 (완료)
│   ├── stores/
│   │   └── authStore.ts                          # Zustand 인증 상태 (완료)
│   ├── hooks/
│   │   └── useAuth.ts                            # 인증 훅 (완료)
│   └── lib/
│       └── api.ts                                # API 호출 함수 (완료)
```

## 핵심 설정 정보

### 환경변수 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=실제_구글_클라이언트_ID
NEXT_PUBLIC_KAKAO_CLIENT_ID=실제_카카오_클라이언트_ID
NEXT_PUBLIC_NAVER_CLIENT_ID=실제_네이버_클라이언트_ID
```

### OAuth 설정
- Redirect URI: `http://localhost:3000/auth/callback/{provider}`
- 백엔드 설정: `google.redirect-uri=http://localhost:3000/auth/callback/google`

### 주요 API 엔드포인트
#### 인증
- POST /api/v1/auth/google/login    # 구글 로그인
- POST /api/v1/auth/kakao/login     # 카카오 로그인
- POST /api/v1/auth/naver/login     # 네이버 로그인
- GET /api/v1/members/me            # 사용자 정보 조회

#### 프롬프트(미구현)
- GET /api/v1/prompts               # 프롬프트 목록 (페이징)
- GET /api/v1/prompts/{id}          # 프롬프트 상세
- POST /api/v1/prompts              # 프롬프트 작성
- GET /api/v1/prompts/popular       # 인기 프롬프트

#### 기타
- GET /api/v1/categories            # 카테고리 목록

## UI 디자인 시스템

### 색상 테마
- 배경: `bg-slate-900`, `bg-slate-800`
- 텍스트: `text-white`, `text-gray-300`
- 그라데이션: `from-purple-400 to-cyan-400`, `from-purple-500 to-cyan-500`
- 액센트: `text-cyan-400`, `hover:text-cyan-400`

### 주요 컴포넌트 스타일
```css
/* 메인 버튼 */
bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg

/* 보조 버튼 */
border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400 hover:text-slate-900

/* 카드 */
bg-slate-800 rounded-xl border border-slate-700

/* 헤더 */
bg-slate-900/80 backdrop-blur-sm border-b border-slate-700

## 다음 개발 우선순위
### 1. 프롬프트 목록 페이지 (/prompts)

- 백엔드 GET /api/v1/prompts API 연동
- 페이지네이션 구현
- 카테고리 필터링
- 검색 기능

### 2. 프롬프트 상세 페이지 (/prompts/[id])

- 백엔드 GET /api/v1/prompts/{id} API 연동
- 좋아요 기능
- 조회수 표시

### 3. 프롬프트 작성 페이지 (/prompts/create)

- 백엔드 POST /api/v1/prompts API 연동
- 마크다운 에디터
- 카테고리 선택

## 현재 상태

- 인증 시스템 완전 구현됨
- 홈페이지 UI 완성
- 백엔드 API 준비 완료
- 다음: 실제 프롬프트 기능 구현 시작

## 개발 시 주의사항

- 모든 API 호출에 Authorization 헤더 포함: Bearer ${accessToken}
- 401 에러 시 자동 로그아웃 처리
- 페이지 라우팅 시 Next.js App Router 방식 사용
- 상태 관리는 Zustand 스토어 활용