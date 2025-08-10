## Smart Calendar

세련된 캘린더와 업무 칸반을 하나로 묶은 2025형 일정관리 웹앱. Next.js(App Router) + Tailwind + 로컬스토리지 MVP로 즉시 실행 가능하며, 월/주/일 뷰의 디테일한 시각화와 "업무" 전용 보드를 제공합니다.

### ✨ Highlights

- **빠른 시작**: 테스트 시드가 포함된 로컬스토리지 MVP — 설치 후 즉시 사용
- **캘린더(월/주/일)**:
  - 월간: 미니멀(컬러 점 + 제목), 종일 이벤트만 옅은 배경
  - 주/일간: 파스텔 반투명 배경 + 얇은 보더, 겹침 방지, 줄임표 처리, 오늘 강조(1px 인디고)
  - 카테고리/하위카테고리 칩 표시(반투명 테두리)
- **업무(Task) 칸반**: "업무" 일정 클릭 → 우측 사이드 보드 열림(드래그/정렬/편집/삭제)
  - 보드 상단에서 해당 일정(제목/하위/시간/종일) 즉시 수정 가능
  - 드래그 핸들/드롭 하이라이트/우선순위 배지/툴팁/토스트
- **관리자**: 카테고리/하위 관리, 상위 카테고리 색상 팔레트(중앙 모달)
- **품질**: Vitest + Playwright(E2E) 기본 시나리오 기반

### 🧭 Tech Stack

- Next.js(App Router), React, TypeScript
- TailwindCSS, ShadCN 스타일 패턴
- FullCalendar(dayGrid/timeGrid/interaction), @hello-pangea/dnd
- LocalStorage 데이터 + React Context Provider

### 🚀 Getting Started

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000` → "시작하기" 버튼 → `/calendar`로 이동합니다.

### 🗺️ UX Principles

- Linear 톤 차용: 중립 그레이, 얇은 보더, 섬세한 호버, 보라/인디고 포인트
- 미니멀 레이아웃: 과한 배경 카드 지양, 정보밀도/가독성 우선
- 즉시성: 사이드패널에서 업무 일정 직접 편집, 토스트로 피드백

### 📌 Roadmap (MVP 이후)

- 칩 단일행 강제 로직 안정화(측정 타이밍 개선)
- 캘린더/칸반 상호작용 E2E(겹침/칩/드래그/패널 수정)
- 접근성(A11y): 포커스 링/키보드 내비/명도 대비
- JSON-LD(마케팅), 다국어(i18n)
- 데이터 백엔드 전환: Supabase(인증/DB/Storage) + Prisma

### 📄 문서

- `doc/todo.md`: 체크리스트 및 작업 현황
- `ai-context.md`: AI 작업 컨텍스트(아키텍처/규칙/변경 이력)

---

Copyright © Smart Calendar
