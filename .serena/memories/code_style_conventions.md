# Smart Calendar - 코드 스타일 및 컨벤션

## 🎯 핵심 원칙

### 1. TypeScript 엄격 모드
- **strict: true** 설정으로 타입 안전성 최대화
- **allowJs: false** - JavaScript 파일 사용 금지
- 모든 변수, 함수, 컴포넌트에 명시적 타입 정의

### 2. 의미 있는 네이밍
- **변수/함수**: camelCase (`getUserEvents`, `selectedDate`)
- **컴포넌트**: PascalCase (`TaskBoard`, `EventModal`)
- **상수**: SCREAMING_SNAKE_CASE (`DEFAULT_VIEW`, `MAX_EVENTS`)
- **타입/인터페이스**: PascalCase (`EventData`, `CalendarView`)

### 3. 코드 구조 원칙
- **Early Return 패턴** 사용으로 중첩 줄이기
- **얕은 중첩** (최대 3 depth)
- **단일 책임 원칙** (함수/컴포넌트당 하나의 역할)

## 📐 Prettier 설정

```json
{
  "semi": true,                  // 세미콜론 필수
  "singleQuote": true,          // 단일 따옴표 사용
  "printWidth": 100,            // 라인 길이 100자
  "trailingComma": "all"        // 후행 쉼표 모든 곳에
}
```

### 포맷팅 예시
```typescript
// ✅ 올바른 형태
const eventData: EventData = {
  id: generateId(),
  title: 'Meeting',
  startTime: new Date(),
  category: 'work',
};

// ❌ 잘못된 형태
const eventData = {
  id: generateId(),
  title: "Meeting",
  startTime: new Date(),
  category: "work"
}
```

## 🔍 ESLint 설정

### 기본 규칙
- **next/core-web-vitals** + **eslint:recommended** 확장
- **no-console**: warn (단, console.warn, console.error는 허용)
- **@next/next/no-html-link-for-pages**: off

### 커스텀 규칙
```json
{
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@next/next/no-html-link-for-pages": "off"
  }
}
```

## 🏗️ 컴포넌트 작성 컨벤션

### 1. 컴포넌트 구조
```typescript
// 1. 타입 정의
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

// 2. 컴포넌트 선언
export function MyComponent({ title, onSubmit, isLoading = false }: ComponentProps) {
  // 3. 훅스
  const [state, setState] = useState();
  
  // 4. 이벤트 핸들러
  const handleSubmit = useCallback(() => {
    // 구현
  }, []);
  
  // 5. Early return (조건부 렌더링)
  if (!title) {
    return <div>No title provided</div>;
  }
  
  // 6. JSX 반환
  return (
    <div className="component-wrapper">
      {/* 구현 */}
    </div>
  );
}
```

### 2. 훅스 순서
1. useState, useReducer (상태)
2. useContext (컨텍스트)
3. useEffect, useLayoutEffect (부수 효과)
4. useMemo, useCallback (메모이제이션)
5. 커스텀 훅스

### 3. Props 타입 정의
```typescript
// ✅ 명시적 인터페이스 정의
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// ✅ 기본값 설정
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: ButtonProps) {
  // 구현
}
```

## 📁 파일명 및 폴더 구조 컨벤션

### 파일명 패턴
- **컴포넌트**: PascalCase.tsx (`TaskBoard.tsx`)
- **페이지**: kebab-case (`calendar/page.tsx`)
- **유틸리티**: camelCase.ts (`dateUtils.ts`)
- **타입**: kebab-case.ts (`event-types.ts`)

### Import 순서
```typescript
// 1. React 관련
import React, { useState, useEffect } from 'react';

// 2. 외부 라이브러리
import { format } from 'date-fns';
import { Calendar } from '@fullcalendar/react';

// 3. 내부 절대 경로 (@/)
import { Button } from '@/components/ui/button';
import { useLocalDB } from '@/components/providers/localdb-provider';

// 4. 상대 경로
import './component.css';
```

## 🎨 스타일링 컨벤션

### TailwindCSS 클래스 순서
1. **레이아웃**: display, position, flex, grid
2. **크기**: w-, h-, max-, min-
3. **간격**: m-, p-
4. **타이포그래피**: text-, font-
5. **색상**: bg-, text-, border-
6. **효과**: shadow-, hover:, focus:

### 예시
```tsx
<div className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-2">
  Content
</div>
```

## 📝 주석 및 문서화

### JSDoc 스타일
```typescript
/**
 * 이벤트 데이터를 검증하고 저장합니다.
 * 
 * @param eventData - 저장할 이벤트 데이터
 * @param validateOnly - true일 경우 검증만 수행
 * @returns 저장된 이벤트 ID 또는 검증 결과
 */
export function saveEvent(
  eventData: EventData, 
  validateOnly: boolean = false
): Promise<string | ValidationResult> {
  // 구현
}
```

### 인라인 주석
- 복잡한 로직에만 사용
- `// TODO:`, `// FIXME:`, `// NOTE:` 태그 활용

## 🔄 Git 커밋 컨벤션

### Conventional Commits 형식
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### 타입 분류
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 스타일 변경 (기능 변경 없음)
- **refactor**: 코드 리팩터링
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드, 도구 설정 변경

### 커밋 예시
```
feat(calendar): add monthly view with event clustering

- Implement event grouping for high-density days
- Add expand/collapse functionality for event lists
- Support category-based color coding

Closes #123
```

## 🧪 테스트 컨벤션

### 파일명 패턴
- **유닛 테스트**: `*.test.ts`, `*.spec.ts`
- **E2E 테스트**: `*.spec.ts` (tests/e2e 폴더)

### 테스트 구조
```typescript
describe('EventValidator', () => {
  describe('when validating event data', () => {
    it('should accept valid event with all required fields', () => {
      // Given
      const validEvent = createMockEvent();
      
      // When
      const result = validateEvent(validEvent);
      
      // Then
      expect(result.isValid).toBe(true);
    });
    
    it('should reject event without title', () => {
      // 구현
    });
  });
});
```

## 🚨 에러 처리 패턴

### 함수형 에러 처리
```typescript
// ✅ Result 타입 패턴
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export async function createEvent(data: EventData): Promise<Result<Event>> {
  try {
    const event = await saveToStorage(data);
    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### 컴포넌트 에러 바운더리
- 각 주요 기능별로 에러 바운더리 설정
- 사용자 친화적 에러 메시지 제공