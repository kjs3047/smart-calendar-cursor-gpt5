'use client';

import React from 'react';
import { TaskBoard } from '@/components/kanban/TaskBoard';
import { useLocalDb } from '@/components/providers/localdb-provider';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TaskBoardPage() {
  const { addTask, categories, subcategories, events, ready } = useLocalDb() as any;
  const [workSubToggle, _setWorkSubToggle] = useState('ALL' as string);
  const setWorkSubToggle = (v: string) => {
    _setWorkSubToggle(v);
    try {
      localStorage.setItem('workSubToggle', v);
    } catch {}
  };

  React.useEffect(() => {
    try {
      const v = localStorage.getItem('workSubToggle');
      if (v) _setWorkSubToggle(v);
    } catch {}
  }, []);
  const [pickTargetSubId, setPickTargetSubId] = useState(null as string | null);

  const workCategoryId = useMemo(() => {
    const w = (categories as any[]).find((c: any) => c.name === '업무');
    return w?.id as string | undefined;
  }, [categories]);

  const workSubcats = useMemo(() => {
    if (!workCategoryId) return [] as any[];
    return (subcategories as any[]).filter((s: any) => s.categoryId === workCategoryId);
  }, [subcategories, workCategoryId]);

  const workFilterForSubcat = (subId?: string) => (t: any) => {
    if (!t.eventId || !workCategoryId) return false;
    const ev = (events as any[]).find((e: any) => e.id === t.eventId);
    if (!ev) return false;
    if (ev.categoryId !== workCategoryId) return false;
    if (!subId) return true;
    return ev.subcategoryId === subId;
  };

  if (!ready) {
    return (
      <div className="card-panel p-4">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm">
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-slate-200/70" />
              {Array.from({ length: 4 }).map((__, j) => (
                <div
                  key={j}
                  className="mb-2 h-14 w-full animate-pulse rounded-md bg-slate-200/60"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-panel p-4">
      {/* 업무 서브카테고리 토글 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          className={`rounded-full px-3 py-1 text-sm ${
            workSubToggle === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100'
          }`}
          onClick={() => setWorkSubToggle('ALL')}
        >
          전체
        </button>
        {workSubcats.map((s: any) => (
          <button
            key={s.id}
            className={`rounded-full px-3 py-1 text-sm ${
              workSubToggle === s.id ? 'bg-slate-900 text-white' : 'bg-slate-100'
            }`}
            onClick={() => setWorkSubToggle(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* 표시 로직 */}
      {workSubToggle === 'ALL' ? (
        <div className="flex flex-col gap-6">
          {workSubcats.map((s: any) => (
            <div key={s.id}>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <span>{s.name}</span>
                <Button
                  className="h-8 px-3 text-xs inline-flex items-center gap-1"
                  onClick={() => setPickTargetSubId(s.id)}
                >
                  <Plus size={14} /> 추가
                </Button>
              </div>
              <TaskBoard filter={(t) => workFilterForSubcat(s.id)(t)} enableAdd={false} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>{workSubcats.find((x: any) => x.id === workSubToggle)?.name || ''}</span>
            <Button
              className="h-8 px-3 text-xs inline-flex items-center gap-1"
              onClick={() => setPickTargetSubId(workSubToggle)}
            >
              <Plus size={14} /> 추가
            </Button>
          </div>
          {(events as any[]).some((e: any) => e.subcategoryId === workSubToggle) ? (
            <TaskBoard filter={(t) => workFilterForSubcat(workSubToggle)(t)} enableAdd={false} />
          ) : (
            <div className="pt-8">
              <div className="rounded-md border border-dashed border-slate-200 bg-white/60 px-3 py-6 text-center text-sm text-slate-600">
                해당 하위카테고리 일정이 없습니다. 우측 "추가"로 먼저 일정을 등록하세요.
              </div>
            </div>
          )}
        </div>
      )}

      {pickTargetSubId && (
        <EventPickModal
          subId={pickTargetSubId}
          onClose={() => setPickTargetSubId(null)}
          onPick={(ev: any, title: string) => {
            addTask({ title, status: 'TODO', priority: 'NORMAL', eventId: ev.id });
            setPickTargetSubId(null);
          }}
        />
      )}
    </div>
  );
}
function EventPickModal(props: any) {
  const {
    subId,
    onClose,
    onPick: _onPick,
  } = props as {
    subId: string;
    onClose: () => void;
    onPick: (ev: any, title: string) => void;
  };
  const { categories, events } = useLocalDb() as any;
  const workCategoryId = useMemo(() => {
    const w = (categories as any[]).find((c: any) => c.name === '업무');
    return w?.id as string | undefined;
  }, [categories]);

  const candidates = useMemo(() => {
    if (!workCategoryId) return [] as any[];
    return (events as any[]).filter(
      (e: any) => e.categoryId === workCategoryId && e.subcategoryId === subId,
    );
  }, [events, workCategoryId, subId]);

  const [selectedId, setSelectedId] = useState(candidates[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');

  // 선택된 일정 변경 시 기본 제목 동기화
  React.useEffect(() => {
    const ev = candidates.find((e: any) => e.id === selectedId) ?? candidates[0];
    setTaskTitle(ev ? ev.title : '');
  }, [selectedId, candidates]);

  const formatEventLabel = (e: any) => {
    const st = new Date(e.startsAt);
    const et = new Date(e.endsAt);
    const sameDay = st.toDateString() === et.toDateString();
    const d = new Intl.DateTimeFormat('ko-KR', { month: '2-digit', day: '2-digit' });
    const t = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const range = sameDay
      ? `${d.format(st)} ${t.format(st)}~${t.format(et)}`
      : `${d.format(st)}~${d.format(et)}`;
    return `${e.title} · ${range}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        className="absolute left-1/2 top-24 w-[min(560px,92vw)] -translate-x-1/2 rounded-2xl bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold">일정 선택</h3>
        {candidates.length === 0 ? (
          <div className="mb-4 text-sm text-slate-600">해당 하위카테고리의 일정이 없습니다.</div>
        ) : (
          <>
            <input
              className="mb-2 h-10 w-full rounded-lg border bg-white/60 px-3 text-sm shadow-sm"
              placeholder="할 일 제목"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <select
              className="mb-4 h-10 w-full rounded-lg border bg-white/60 px-3 text-sm shadow-sm"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {candidates.map((e: any) => (
                <option key={e.id} value={e.id}>
                  {formatEventLabel(e)}
                </option>
              ))}
            </select>
          </>
        )}
        <div className="flex justify-end gap-2">
          <Button className="bg-slate-200 text-slate-800" onClick={onClose}>
            취소
          </Button>
          <Button
            disabled={!selectedId || !taskTitle.trim()}
            onClick={() => {
              const ev = candidates.find((e: any) => e.id === selectedId);
              if (ev) _onPick(ev, taskTitle.trim());
            }}
          >
            선택
          </Button>
        </div>
      </div>
    </div>
  );
}
