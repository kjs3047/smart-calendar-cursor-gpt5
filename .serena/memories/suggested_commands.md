# Smart Calendar - 추천 명령어 가이드

## 🚀 개발 명령어

### 프로젝트 시작
```bash
# 의존성 설치
pnpm install

# 개발 서버 시작 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start
```

### 코드 품질 및 테스팅
```bash
# ESLint 검사 및 자동 수정
pnpm lint

# 유닛 테스트 실행
pnpm test

# 유닛 테스트 (watch 모드)
pnpm test:watch

# E2E 테스트 실행
pnpm test:e2e

# 타입 체크 (TypeScript)
npx tsc --noEmit
```

## 🪟 Windows 시스템 명령어

### 파일 시스템 탐색
```cmd
# 디렉토리 내용 조회
dir
ls (PowerShell)

# 파일 내용 보기
type filename.txt
Get-Content filename.txt (PowerShell)

# 파일/폴더 검색
dir /s /b *pattern*
Get-ChildItem -Recurse -Name "*pattern*" (PowerShell)

# 현재 위치 확인
cd
pwd (PowerShell)

# 디렉토리 이동
cd path\to\directory
```

### 텍스트 검색
```cmd
# 파일 내용에서 패턴 검색
findstr "pattern" *.txt
Select-String "pattern" *.txt (PowerShell)

# 대소문자 구분 없이 검색
findstr /i "pattern" *.txt
Select-String "pattern" *.txt -CaseSensitive:$false (PowerShell)
```

### 프로세스 관리
```cmd
# 실행 중인 프로세스 조회
tasklist
Get-Process (PowerShell)

# 특정 프로세스 종료
taskkill /f /pid <process_id>
Stop-Process -Id <process_id> (PowerShell)

# 포트 사용 중인 프로세스 확인
netstat -ano | findstr :3000
```

## 📦 패키지 관리

### pnpm 명령어 (권장)
```bash
# 패키지 설치
pnpm add <package-name>
pnpm add -D <package-name>  # 개발 의존성

# 패키지 제거
pnpm remove <package-name>

# 의존성 업데이트
pnpm update

# 캐시 정리
pnpm store prune

# 전역 패키지 조회
pnpm list -g
```

### npm 대체 명령어 (필요시)
```bash
npm install      → pnpm install
npm run dev      → pnpm dev
npm run build    → pnpm build
npm test         → pnpm test
```

## 🔧 Git 워크플로우

### 기본 Git 명령어
```bash
# 상태 확인
git status

# 변경사항 확인
git diff
git diff --staged

# 파일 추가 및 커밋
git add .
git add <file-name>
git commit -m "feat(component): add new feature"

# 브랜치 관리
git branch                    # 브랜치 목록
git checkout -b feature/name  # 새 브랜치 생성 및 이동
git merge <branch-name>       # 브랜치 병합

# 원격 저장소 동기화
git pull origin main
git push origin <branch-name>
```

### 커밋 메시지 예시
```bash
# 기능 추가
git commit -m "feat(calendar): add monthly view pagination"

# 버그 수정
git commit -m "fix(kanban): resolve drag drop positioning issue"

# 리팩터링
git commit -m "refactor(utils): extract date formatting utilities"

# 문서 업데이트
git commit -m "docs(readme): update installation instructions"
```

## 🛠️ 개발 도구

### 에디터 설정
```bash
# VS Code에서 프로젝트 열기
code .

# VS Code 확장 프로그램 (권장)
# - TypeScript Hero
# - Tailwind CSS IntelliSense  
# - Prettier - Code formatter
# - ESLint
# - Auto Rename Tag
```

### 유용한 개발 명령어
```bash
# package.json 스크립트 확인
pnpm run

# 의존성 트리 확인
pnpm list
pnpm list --depth=0  # 최상위만

# 보안 취약점 검사
pnpm audit
pnpm audit --fix

# 번들 분석 (Next.js)
npx @next/bundle-analyzer
```

## 🐛 디버깅 및 문제 해결

### 개발 서버 문제
```bash
# 포트 3000이 사용 중일 때
netstat -ano | findstr :3000
taskkill /f /pid <process_id>

# 캐시 초기화
pnpm clean (custom script가 있다면)
rm -rf .next (PowerShell: Remove-Item -Recurse .next)
rm -rf node_modules (PowerShell: Remove-Item -Recurse node_modules)
pnpm install
```

### 타입스크립트 오류 해결
```bash
# 타입 체크 실행
npx tsc --noEmit

# 타입 정의 파일 재생성
rm -rf .next/types
pnpm dev  # 자동으로 타입 파일 생성
```

### 테스트 실패 시
```bash
# 특정 테스트 파일만 실행
pnpm test -- calendar.test.ts

# 상세한 오류 정보와 함께 실행
pnpm test -- --reporter=verbose

# E2E 테스트 헤드리스 모드 해제 (브라우저에서 확인)
npx playwright test --headed
```

## 📊 성능 모니터링

### Next.js 성능 분석
```bash
# 빌드 분석
pnpm build
ANALYZE=true pnpm build  # bundle analyzer 사용 시

# 성능 측정
npm run dev
# http://localhost:3000 접속 후 DevTools > Lighthouse 실행
```

### 메모리 및 번들 크기 확인
```bash
# 번들 크기 분석
npx next build --analyze

# 의존성 크기 확인
npx depcheck
npx package-size <package-name>
```

## 💡 유용한 팁

### 빠른 개발을 위한 단축키
```bash
# 개발 환경 한 번에 시작
pnpm dev & code .

# 테스트와 개발 서버 동시 실행
pnpm dev & pnpm test:watch

# 프로덕션 환경 테스트
pnpm build && pnpm start
```

### 환경 변수 설정
```bash
# 로컬 환경 변수 파일 생성
copy env.sample .env.local  # Windows
cp env.sample .env.local    # PowerShell/Git Bash
```

이 가이드에 따라 Smart Calendar 프로젝트를 효율적으로 개발할 수 있습니다.