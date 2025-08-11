# Smart Calendar - 프로젝트 구조

## 📁 디렉토리 구조 개요

```
smart-calendar-cursor-gpt5/
├── app/                     # Next.js App Router 페이지
├── components/              # 재사용 가능한 컴포넌트
├── lib/                     # 유틸리티 및 비즈니스 로직
├── styles/                  # 글로벌 스타일
├── tests/                   # 테스트 파일
├── types/                   # TypeScript 타입 정의
├── doc/                     # 프로젝트 문서
├── prisma/                  # 데이터베이스 스키마 (향후)
└── 설정 파일들
```

## 🏗️ 핵심 디렉토리 상세

### `/app` - Next.js App Router 페이지
```
app/
├── layout.tsx              # 루트 레이아웃 (HTML, 메타데이터)
├── page.tsx               # 홈페이지 (랜딩)
├── (dashboard)/           # 대시보드 라우트 그룹
│   ├── layout.tsx         # 대시보드 공통 레이아웃
│   ├── calendar/
│   │   └── page.tsx       # 캘린더 메인 페이지
│   └── tasks/
│       └── page.tsx       # 업무 관리 페이지
├── admin/                 # 관리자 페이지
│   ├── layout.tsx         # 관리자 레이아웃
│   └── categories/
│       └── page.tsx       # 카테고리 관리
├── api/                   # API 라우트
│   └── upload/
│       └── route.ts       # 파일 업로드 API
├── robots.txt/
│   └── route.ts          # robots.txt 생성
└── sitemap.ts            # 사이트맵 생성
```

**라우팅 구조**:
- `/` - 랜딩 페이지
- `/calendar` - 캘린더 메인 (대시보드)
- `/tasks` - 업무 칸반 보드
- `/admin/categories` - 카테고리 관리

### `/components` - UI 컴포넌트
```
components/
├── ui/                    # 기본 UI 컴포넌트 (ShadCN 스타일)
│   ├── button.tsx         # 버튼 컴포넌트
│   ├── input.tsx          # 입력 필드
│   ├── select.tsx         # 셀렉트 박스
│   ├── badge.tsx          # 배지/태그
│   ├── skeleton.tsx       # 로딩 스켈레톤
│   ├── tooltip.tsx        # 툴팁
│   └── empty.tsx          # 빈 상태 UI
├── providers/             # Context Provider 컴포넌트
│   ├── localdb-provider.tsx    # LocalDB 상태 관리
│   └── toast-provider.tsx      # 토스트 알림 관리
├── kanban/               # 칸반 관련 컴포넌트
│   └── TaskBoard.tsx     # 업무 칸반 보드
└── auth/                 # 인증 관련 컴포넌트 (향후)
    ├── google-signin-button.tsx
    └── local-auth-buttons.tsx
```

### `/lib` - 비즈니스 로직 및 유틸리티
```
lib/
├── types.ts              # 전역 타입 정의
├── localdb.ts           # LocalStorage CRUD 로직
├── supabase.ts          # Supabase 클라이언트 설정 (향후)
├── utils/               # 유틸리티 함수들
│   ├── cn.ts           # className 병합 유틸리티
│   ├── color.ts        # 색상 관련 유틸리티
│   ├── date.ts         # 날짜 조작 함수
│   └── datetime.ts     # 날짜/시간 포맷팅
└── validators/          # Zod 스키마 검증
    ├── category.ts      # 카테고리 스키마
    └── event.ts         # 이벤트 스키마
```

### `/tests` - 테스트 파일
```
tests/
├── unit/                # 유닛 테스트
│   └── date.test.ts     # 날짜 유틸리티 테스트
└── e2e/                 # E2E 테스트 (Playwright)
    └── home.spec.ts     # 홈페이지 E2E 테스트
```

## ⚙️ 설정 파일들

### TypeScript 설정
- `tsconfig.json` - TS 컴파일러 옵션, path aliases (`@/*`)
- `next-env.d.ts` - Next.js 타입 정의

### 빌드 및 번들링
- `next.config.mjs` - Next.js 설정 (typedRoutes 활성화)
- `postcss.config.mjs` - PostCSS 설정
- `tailwind.config.ts` - TailwindCSS 커스텀 설정

### 코드 품질
- `.eslintrc.json` - ESLint 규칙
- `.prettierrc` - Prettier 포맷팅 설정
- `.gitignore` - Git 무시 파일 목록

### 테스팅
- `vitest.config.ts` - Vitest 설정 (유닛 테스트)
- `vitest.setup.ts` - 테스트 환경 설정
- `playwright.config.ts` - Playwright 설정 (E2E 테스트)

### 패키지 관리
- `package.json` - 프로젝트 메타데이터, 의존성, 스크립트
- `pnpm-lock.yaml` - 패키지 잠금 파일
- `env.sample` - 환경 변수 템플릿

## 🧭 아키텍처 패턴

### 1. 계층화 구조
```
Presentation Layer (UI)
├── app/ (페이지)
├── components/ (컴포넌트)

Business Logic Layer
├── lib/localdb.ts (데이터 로직)
├── lib/validators/ (검증 로직)
└── lib/utils/ (유틸리티)

Data Layer
└── LocalStorage (현재)
└── Supabase (향후)
```

### 2. 컴포넌트 설계 패턴

#### UI 컴포넌트 (`/components/ui`)
- **Headless UI 패턴**: 로직과 스타일 분리
- **Compound Component**: 복합 컴포넌트 구조
- **Polymorphic Components**: 태그 변경 가능한 컴포넌트

#### Feature 컴포넌트 (`/components/[feature]`)
- **Container-Presenter 패턴**: 로직과 표현 분리
- **Custom Hooks**: 상태 로직 추상화

### 3. 상태 관리 패턴
```typescript
// Context + Provider 패턴
const LocalDBContext = createContext<LocalDBContextValue | undefined>(undefined);

// Custom Hook
export function useLocalDB() {
  const context = useContext(LocalDBContext);
  if (!context) {
    throw new Error('useLocalDB must be used within LocalDBProvider');
  }
  return context;
}
```

### 4. 라우팅 패턴
- **Route Groups**: `(dashboard)` - URL에 영향 없는 그룹핑
- **Nested Layouts**: 계층적 레이아웃 구조
- **Typed Routes**: `typedRoutes: true` - 타입 안전한 라우팅

## 📦 의존성 관리 전략

### 핵심 원칙
1. **최소 의존성**: 꼭 필요한 패키지만 설치
2. **보안 우선**: 정기적인 의존성 업데이트
3. **번들 크기 최적화**: Tree shaking 활용
4. **타입 안전성**: 모든 패키지에 타입 정의 확보

### 의존성 카테고리
```json
{
  "dependencies": {
    // 프레임워크 & 런타임
    "next": "^14.2.5",
    "react": "^18.2.0",
    
    // UI 라이브러리
    "@fullcalendar/react": "^6.1.11",
    "@hello-pangea/dnd": "^16.5.0",
    
    // 유틸리티
    "date-fns": "^3.6.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    // 개발 도구
    "typescript": "^5.5.3",
    "eslint": "^8.57.0",
    
    // 테스팅
    "vitest": "^2.0.5",
    "playwright": "^1.45.3"
  }
}
```

## 🔄 데이터 플로우

### 현재 (LocalStorage 기반)
```
UI Component 
    ↓
useLocalDB Hook 
    ↓
LocalDB Context 
    ↓
lib/localdb.ts 
    ↓
localStorage API
```

### 향후 (Supabase 기반)
```
UI Component 
    ↓
useLocalDB Hook 
    ↓
LocalDB Context 
    ↓
lib/supabase.ts 
    ↓
Supabase Client 
    ↓
PostgreSQL
```

## 📝 파일 네이밍 규칙

### 컨벤션 요약
```
컴포넌트:     PascalCase.tsx     (TaskBoard.tsx)
페이지:       page.tsx           (app/calendar/page.tsx)
레이아웃:     layout.tsx         (app/layout.tsx)
API 라우트:   route.ts           (app/api/upload/route.ts)
유틸리티:     camelCase.ts       (dateUtils.ts)
타입 정의:    kebab-case.ts      (event-types.ts)
테스트:       *.test.ts          (calendar.test.ts)
스타일:       globals.css        (styles/globals.css)
```

이 구조를 통해 확장 가능하고 유지보수하기 쉬운 애플리케이션을 구축할 수 있습니다.