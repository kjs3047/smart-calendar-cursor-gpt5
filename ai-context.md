## 🧠 AI 초기 컨텍스트 · Smart Calendar

### 🔧 기술 스택 및 아키텍처

- Next.js(App Router) · React 18 · TypeScript
- TailwindCSS
- 캘린더: `@fullcalendar/react` (+ daygrid/timegrid/interaction)
- 칸반: `@hello-pangea/dnd`
- 로컬 데이터: LocalStorage 기반 `lib/localdb.ts` + 컨텍스트 프로바이더
- Test: Vitest · Testing Library · Playwright

아키텍처: 서버 연동 없이 클라이언트 전용 로컬스토리지 DB와 컨텍스트 상태로 MVP 구현. 이후 Supabase/Prisma 전환 예정(현재 제외).

### 📁 핵심 파일

- 데이터: `lib/localdb.ts`(시드·CRUD), `lib/types.ts`, `lib/utils/color.ts`
- 컨텍스트: `components/providers/localdb-provider.tsx`
- UI: `components/ui/{button,input,select}.tsx`, 글로벌 스타일 `styles/globals.css`
- 캘린더: `app/(dashboard)/calendar/page.tsx`
  - 월간: 미니멀 카드(좌측 컬러 점 + 제목), 종일 이벤트는 옅은 배경
  - 주/일간: 파스텔 배경/보더, 카테고리/하위칩, 겹침 방지 및 줄임표
  - 뷰 기억, 드래그 위치/호버 텍스트 보정
- 칸반: `components/kanban/TaskBoard.tsx`
  - 드래그 핸들/드롭 하이라이트/우선순위 배지/툴팁/토스트
  - 업무 일정 사이드패널에서 일정 수정 폼 제공(제목/하위/시간/종일)
- 관리자: `app/admin/categories/page.tsx`
  - 상위 카테고리 색상 팔레트 모달(중앙), 하위 색상 선택 제거

### 📌 현재 구현 상태

- 캘린더: 빠른 생성·수정/삭제·드래그/리사이즈, 미니멀/파스텔 테마, 겹침 방지/줄임표 적용 ✅
- 칸반: 카드 추가/이동/편집/삭제, 업무 패널 내 일정 수정 폼 ✅
- 관리자: 카테고리/하위 CUD, 상위 색상 팔레트, 하위 색상 선택 제거 ✅ (비활성화 토글 예정)
- 테스트: 기본 유닛, 홈 E2E ✅ (상호작용 E2E는 예정)
- 스타일: 2025 톤(유리 패널, 그라데이션, 라운드/섀도우) ✅

### ✍️ 컨벤션

- TS strict, 의미있는 네이밍, early-return, 얕은 중첩
- 커밋: Conventional Commits

### 🎯 다음 작업(우선순위)

- 칩 단일행 강제 로직 안정화(측정 타이밍 개선)
- 캘린더/칸반 상호작용 E2E(겹침/칩/드래그/패널 수정)
- 접근성(포커스 링/키보드 내비)
- JSON-LD(마케팅)

### 🛠️ 최근 변경 요약

- 업무(Task) 메뉴 리디자인: 상단 탭(All/My/Unscheduled/Scheduled) 제거, "업무" 하위카테고리 토글만 유지
- 각 하위카테고리 섹션 헤더에 `추가` 버튼 도입 → EventPickModal에서 기존 "업무" 일정 선택 후 해당 일정의 제목/시간을 상속한 Task 생성
- `TaskBoard`에 `enableAdd` 옵션 추가(기본 true), 업무 페이지에서는 `enableAdd={false}`로 인라인 입력 숨김
