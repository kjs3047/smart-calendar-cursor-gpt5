# Smart Calendar - 기술 스택

## 🏗️ 핵심 프레임워크

### Frontend Framework
- **Next.js 14.2.5** (App Router)
- **React 18.2.0**
- **TypeScript 5.5.3** (strict mode)

### 스타일링
- **TailwindCSS 3.4.7**
- **PostCSS 8.4.38**
- **TailwindCSS Animate 1.0.7**
- **Autoprefixer 10.4.19**

### 디자인 시스템
- **ShadCN 스타일 패턴** (커스텀 구현)
- **Lucide React 0.428.0** (아이콘)
- **Class Variance Authority 0.7.0** (컴포넌트 변형 관리)
- **clsx 2.1.1** + **tailwind-merge 2.4.0** (클래스 병합)

## 📦 주요 라이브러리

### 캘린더 시스템
- **@fullcalendar/react 6.1.11** (핵심)
- **@fullcalendar/daygrid 6.1.11** (월간 뷰)
- **@fullcalendar/timegrid 6.1.11** (주/일간 뷰)
- **@fullcalendar/interaction 6.1.11** (드래그앤드롭)

### 드래그앤드롭 & 칸반
- **@hello-pangea/dnd 16.5.0** (React DnD 라이브러리)

### 날짜/시간 처리
- **date-fns 3.6.0** (날짜 조작)
- **date-fns-tz 3.0.0** (타임존 처리)

### 폼 & 검증
- **react-hook-form 7.51.5** (폼 관리)
- **zod 3.23.8** (스키마 검증)

### 데이터 계층
- **LocalStorage** (현재 MVP)
- **@supabase/supabase-js 2.45.3** (향후 백엔드)

## 🧪 테스팅 & 품질 보장

### 유닛 테스팅
- **Vitest 2.0.5** (테스트 러너)
- **@testing-library/react 16.0.0** (컴포넌트 테스팅)
- **@testing-library/jest-dom 6.4.8** (DOM 매처)
- **jsdom 24.1.1** (브라우저 환경 시뮬레이션)

### E2E 테스팅
- **Playwright 1.45.3**
- **@playwright/test 1.45.3**

### 코드 품질
- **ESLint 8.57.0** + **eslint-config-next 14.2.5**
- **Prettier** (코드 포맷팅)

## ⚙️ 개발 환경

### 런타임 요구사항
- **Node.js ≥18.17.0**
- **pnpm** (패키지 매니저)

### 빌드 도구
- **Next.js 내장 번들러** (Webpack 기반)
- **TypeScript 컴파일러**

### 설정 파일들
- `next.config.mjs`: Next.js 설정 (typedRoutes 활성화)
- `tsconfig.json`: TypeScript 설정 (strict mode, path aliases)
- `tailwind.config.ts`: TailwindCSS 설정 (커스텀 컬러 팔레트)
- `vitest.config.ts`: Vitest 설정
- `playwright.config.ts`: Playwright 설정

## 🎨 디자인 토큰

### 컬러 시스템
```css
primary: #6366F1     /* indigo-500 */
secondary: #6E56CF   /* violet-ish */
accent: #0EA5E9      /* sky-500 */
```

### 브레이크포인트
- TailwindCSS 기본 반응형 시스템 사용

## 🚀 배포 준비

### 프로덕션 최적화
- Next.js 자동 최적화 (코드 스플리팅, 이미지 최적화)
- TypeScript 타입 체크
- ESLint 규칙 검증

### 향후 백엔드 연동
- **Supabase**: 인증, 데이터베이스, 스토리지
- **Prisma**: ORM 및 타입 안전성

## 📚 아키텍처 패턴

- **App Router** (Next.js 13+ 권장 패턴)
- **React Server Components** + Client Components 조합
- **Context API** (클라이언트 상태 관리)
- **LocalStorage** (데이터 영속성)
- **컴포넌트 합성** (재사용성)