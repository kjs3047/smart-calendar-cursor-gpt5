import { StartNowButton } from '@/components/auth/local-auth-buttons';

export default function Page() {
  return (
    <main className="flex flex-col items-center gap-10 text-center">
      <section className="mt-16 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          일정과 업무를 하나로, 세련된 캘린더
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          카테고리 색상과 칸반으로 집중력을 높이는 2025 트렌드 캘린더.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <StartNowButton />
          <a href="/calendar" className="btn-secondary">
            데모 보기
          </a>
        </div>
      </section>
      <section className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card-panel p-6 text-left">
          <h3 className="mb-2 text-base font-semibold">컬러풀한 일정</h3>
          <p className="text-sm text-slate-600">카테고리 색상으로 한눈에 구분되는 일정 카드.</p>
        </div>
        <div className="card-panel p-6 text-left">
          <h3 className="mb-2 text-base font-semibold">업무 칸반</h3>
          <p className="text-sm text-slate-600">업무 일정에서 보드를 열어 빠르게 작업을 정리.</p>
        </div>
        <div className="card-panel p-6 text-left">
          <h3 className="mb-2 text-base font-semibold">빠른 일정 생성</h3>
          <p className="text-sm text-slate-600">
            셀을 드래그/선택하고 바로 제목과 카테고리를 지정.
          </p>
        </div>
      </section>
    </main>
  );
}
