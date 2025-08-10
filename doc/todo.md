## ✅ 프로젝트 체크리스트 (MVP 중심)

> 진행 시 각 항목 체크 및 `ai-context.md`에 상태를 동기화하세요.

### 🧭 0. 프로젝트 세팅

- [x] Next.js(App Router) + TypeScript 초기화
- [x] Tailwind CSS 구성 (ShadCN 컴포넌트는 이후 필요 시 추가)
- [x] `lucide-react`, `react-hook-form`, `zod` 설치 (deps 추가)
- [x] ESLint/Prettier 설정, TS `strict` 활성화
- [x] 환경 변수 스켈레톤 → (로컬스토리지 MVP 전환으로 보류)
- [ ] Vercel 프로젝트 생성(옵션)

### 🔐 1. 인증 (Supabase Auth · Google)

- [ ] Supabase 프로젝트 생성, Google Provider 설정 (보류)
- [ ] `supabase-js` 클라이언트 설정 (보류)
- [x] 로컬 시작/로그아웃 버튼(의사 인증) 구성
- [ ] 로그인 성공 시 `profiles` upsert 서버 액션 (보류)
- [ ] 테스트 (보류)

### 🗄️ 2. 데이터/ORM (로컬스토리지)

- [x] 로컬스토리지 데이터 모델/시드(`lib/localdb.ts`) 구축
- [x] 도메인 타입 정의(`lib/types.ts`)
- [x] 전역 컨텍스트 프로바이더(`components/providers/localdb-provider.tsx`)
- [-] (Prisma/마이그레이션/시드) — 로컬 MVP에서 제외

### 🗂️ 3. 카테고리/하위카테고리(관리자)

- [x] 목록/생성 UI (간단 입력 + 색상 선택)
- [x] 수정 UI (이름/색상 인라인 수정)
- [x] 삭제 UI (사용 중이면 삭제 방지 안내)
- [ ] 비활성화 UI (토글) — 추가 예정
- [x] 하위카테고리 추가 UI
- [x] 하위카테고리 수정/삭제 UI
- [ ] 단위 테스트: 밸리데이션(zod) — 추가 예정

### 🗓️ 4. 캘린더 뷰 + 일정 CRUD

- [x] FullCalendar 도입(dayGrid/timeGrid/interaction)
- [x] 월/주/일 뷰 전환, 범위 로딩
- [x] 빠른 일정 생성(셀 선택 → 제목/카테고리)
- [x] 드래그/리사이즈로 시간 이동·수정
- [x] 일정 수정/삭제 모달
- [x] 카테고리 색상 적용(배경/보더/텍스트 대비)
- [x] 하위카테고리/카테고리 칩(월/주/일) 표시, 월간은 종일만 배경
- [x] 주/일간 파스텔 배경/보더, 겹침 방지 설정(`eventOverlap/slotEventOverlap=false`)
- [ ] 칩 단일행 강제 로직 안정화(측정 타이밍 개선)
- [ ] E2E: 다중 일정 겹침/칩 표시/드래그 확인

### 🧩 5. 업무(Task) 칸반

- [x] 업무 일정 클릭 시 사이드패널 보드 열림
- [x] 열: Todo/In-Progress/Blocked/Done
- [x] 카드 추가 + 드래그 정렬(컬럼 이동)
- [x] 카드 편집/삭제
- [x] 업무 대메뉴 리디자인: 상단 탭 제거, 하위카테고리 섹션별 `추가` 버튼 + 기존 일정 선택(EventPickModal)로 Task 생성
- [x] `TaskBoard` 인라인 추가 입력 숨김(`enableAdd=false`)
- [x] 일정 수정 폼(사이드패널 상단) 추가: 제목/하위/시간/종일 편집
- [ ] 단위 테스트: 정렬/상태 전이 로직
- [ ] E2E: 카드 생성→이동→삭제/일정 수정 반영

### 📎 6. 첨부파일(Storage)

- [ ] 전면 보류 (로컬 MVP 범위 외)

### 🔎 7. SEO/접근성

- [x] App Router `metadata`(title/desc/OG)
- [x] `/sitemap.xml`, `/robots.txt`
- [ ] JSON-LD(마케팅 페이지)
- [ ] 접근성 점검(키보드 내비/명도, 포커스 링 시인성)

### 🧪 8. 테스트 & 품질 (TDD)

- [x] Vitest 환경 구성 + 기본 단위 테스트
- [x] Playwright E2E(홈 CTA)
- [ ] 캘린더/칸반 상호작용 E2E (칩/겹침/드래그/사이드 수정)

### 🔐 9. 보안/RLS(문서/승인 필요)

- [x] 보류 (로컬 MVP)

### 🚀 10. 배포

- [ ] Vercel (옵션) — 후속 단계

---

## 🎨 컬러 팔레트

- Primary `#7C3AED` · Secondary `#22C55E` · Accent `#F59E0B` · Info `#0EA5E9` · Danger `#EF4444`

## 🧭 수용 기준 요약

- 겹치는 일정이 시간대 별로 모두 보이고 빠른 생성·수정·삭제 가능(드래그/리사이즈 포함)
- "업무" 일정에서 칸반 보드 열림 및 카드 추가/이동/편집/삭제 반영
- 관리자에서 카테고리/하위카테고리 CUD 및 사용 중 삭제 방지 안내
- 기본 단위/E2E 테스트 통과
