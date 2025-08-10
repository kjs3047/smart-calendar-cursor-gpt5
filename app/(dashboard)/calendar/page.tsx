'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { Save, X, Trash2, Plus } from 'lucide-react';
import { useLocalDb } from '@/components/providers/localdb-provider';
import { TaskBoard } from '@/components/kanban/TaskBoard';
import { getContrastingTextColor } from '@/lib/utils/color';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toLocalInputValue, inputValueToIso } from '@/lib/utils/datetime';
import { useToast } from '@/components/providers/toast-provider';

export default function CalendarPage() {
  const { events, categories, subcategories, addEvent, updateEvent, removeEvent, ready } =
    useLocalDb() as any;
  const { showToast } = useToast();
  const [kanbanEventId, setKanbanEventId] = useState(null as string | null);
  const [initialView, setInitialView] = useState('timeGridWeek');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [nowTick, setNowTick] = useState(new Date());
  const [draft, setDraft] = useState(
    null as {
      id?: string;
      title: string;
      start: string;
      end: string;
      allDay: boolean;
      categoryId?: string;
      subcategoryId?: string | null;
    } | null,
  );
  const [draftCategory, setDraftCategory] = useState('' as string);
  const [draftSub, setDraftSub] = useState(null as string | null);

  const catMap = (() => {
    const map: Record<string, { name: string; colorHex: string }> = {};
    (categories as any[]).forEach((c: any) => (map[c.id] = { name: c.name, colorHex: c.colorHex }));
    return map;
  })();

  const subsByCat = (() => {
    const map: Record<string, any[]> = {};
    (subcategories as any[]).forEach((s: any) => {
      map[s.categoryId] ||= [];
      map[s.categoryId].push(s);
    });
    return map;
  })();

  const subMap = (() => {
    const m: Record<string, any> = {};
    (subcategories as any[]).forEach((s: any) => (m[s.id] = s));
    return m;
  })();

  const fcEvents = (() => {
    return (events as any[]).map((e: any) => {
      const col = catMap[e.categoryId]?.colorHex || '#CBD5E1';
      return {
        id: e.id,
        title: e.title,
        start: e.startsAt,
        end: e.endsAt,
        allDay: e.allDay,
        extendedProps: {
          categoryId: e.categoryId,
          subcategoryId: e.subcategoryId ?? null,
          subcategoryName: e.subcategoryId ? subMap[e.subcategoryId!]?.name : null,
          categoryName: catMap[e.categoryId]?.name || '',
          colorHex: col,
        },
      } as any;
    });
  })();

  const workCategoryId = (() => {
    const found = (categories as any[]).find((c: any) => c.name === '업무');
    return found?.id;
  })();

  const kanbanEvent = kanbanEventId
    ? (events as any[]).find((e: any) => e.id === kanbanEventId)
    : null;
  const [kanbanEdit, setKanbanEdit] = useState(
    null as {
      title: string;
      start: string;
      end: string;
      allDay: boolean;
      subcategoryId: string | null;
    } | null,
  );

  useEffect(() => {
    try {
      const v = localStorage.getItem('fc_view');
      if (v) setInitialView(v);
    } catch {}
  }, []);

  const todayLabel = (() => {
    const m = nowTick.getMonth() + 1;
    const d = nowTick.getDate();
    return `${m}월 ${d}일에 일정 추가`;
  })();

  const handleQuickAdd = () => {
    const title = quickTitle.trim();
    if (!title) return;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const preferredCat =
      (categories as any[]).find((c: any) => c.name === '업무')?.id || (categories as any[])[0]?.id;
    addEvent({
      title,
      description: '',
      categoryId: preferredCat,
      subcategoryId: null,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      allDay: true,
      location: '',
    } as any);
    setQuickTitle('');
    setQuickAddOpen(false);
    showToast('오늘 하루종일 일정이 추가되었습니다', 'success');
  };

  // Tick at next midnight to refresh today label without reload
  useEffect(() => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
    const timeout = next.getTime() - now.getTime();
    const id = setTimeout(() => setNowTick(new Date()), timeout);
    return () => clearTimeout(id);
  }, [nowTick]);

  if (!ready) {
    return (
      <div className="card-panel p-4">
        <div className="mb-3 h-6 w-40 animate-pulse rounded bg-slate-200/70" />
        <div className="h-[520px] rounded-xl border border-slate-200 bg-white/70" />
      </div>
    );
  }

  return (
    <div className="card-panel no-backdrop relative p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView as any}
        locale="ko"
        customButtons={{
          quickAdd: {
            text: todayLabel,
            click: () => setQuickAddOpen(true),
          },
        }}
        buttonText={{
          today: '오늘',
          month: '월',
          week: '주',
          day: '일',
          list: '목록',
        }}
        dayHeaderFormat={{ weekday: 'short', day: '2-digit' } as any}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false } as any}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'quickAdd,dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height="auto"
        slotEventOverlap={false}
        datesSet={(arg: any) => {
          try {
            localStorage.setItem('fc_view', arg.view.type);
          } catch {}
        }}
        events={fcEvents}
        eventContent={(arg: any) => {
          const ep = arg.event.extendedProps as any;
          const color = ep.colorHex || '#E5E7EB';
          const chipLabel = ep.subcategoryName || ep.categoryName || '';
          const adjustChip = (sub: HTMLSpanElement, outer: HTMLElement, titleEl?: HTMLElement) => {
            try {
              requestAnimationFrame(() => {
                const available = Math.max(
                  20,
                  outer.clientWidth - (titleEl ? titleEl.clientWidth : 0) - 12,
                );
                sub.style.maxWidth = available + 'px';
                let size = 10;
                sub.style.fontSize = size + 'px';
                while (size > 8 && sub.scrollWidth > sub.clientWidth) {
                  size -= 0.5;
                  sub.style.fontSize = size + 'px';
                }
                if (sub.scrollWidth > sub.clientWidth) {
                  // fallback to abbreviation
                  const txt = sub.textContent || '';
                  if (txt.length > 2) sub.textContent = txt.slice(0, 2) + '…';
                }
              });
            } catch {}
          };
          if (arg.view.type === 'dayGridMonth' && arg.event.allDay) {
            const outer = document.createElement('div');
            outer.className =
              'flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-slate-800';
            outer.style.backgroundColor = color + '20';
            outer.style.border = '1px solid ' + color + '55';
            const title = document.createElement('span');
            title.className = 'flex-1 truncate';
            title.textContent = arg.event.title;
            outer.appendChild(title);
            if (chipLabel) {
              const sub = document.createElement('span');
              sub.className =
                'ml-1 inline-flex items-center rounded px-1 text-[10px] leading-none text-slate-700';
              sub.style.border = '1px solid ' + color + '66';
              sub.style.whiteSpace = 'nowrap';
              sub.style.overflow = 'hidden';
              sub.style.textOverflow = 'ellipsis';
              sub.textContent = chipLabel;
              outer.appendChild(sub);
              adjustChip(sub, outer, title);
            }
            return { domNodes: [outer] } as any;
          }
          if (arg.view.type !== 'dayGridMonth') {
            const outer = document.createElement('div');
            outer.className =
              'flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] leading-none text-slate-800';
            outer.style.width = '100%';
            outer.style.height = '100%';
            outer.style.boxSizing = 'border-box';
            outer.style.minWidth = '0';
            outer.style.overflow = 'hidden';
            outer.style.backgroundColor = color + '26';
            outer.style.border = '1px solid ' + color + '55';
            const title = document.createElement('span');
            title.className = 'flex-1 truncate';
            title.textContent = arg.event.title;
            outer.appendChild(title);
            if (chipLabel) {
              const sub = document.createElement('span');
              sub.className =
                'ml-1 inline-flex items-center rounded px-1 text-[10px] leading-none text-slate-700';
              sub.style.border = '1px solid ' + color + '66';
              sub.textContent = chipLabel;
              outer.appendChild(sub);
              adjustChip(sub, outer, title);
            }
            return { domNodes: [outer] } as any;
          }
          return {
            domNodes: [
              (() => {
                const outer = document.createElement('div');
                outer.className = 'flex items-center gap-1 px-1.5 py-0.5';
                outer.style.minWidth = '0';
                const dot = document.createElement('span');
                dot.style.backgroundColor = color;
                dot.className = 'inline-block h-2 w-2 rounded-full';
                const title = document.createElement('span');
                title.className = 'flex-1 truncate text-[11px] leading-none text-slate-800';
                title.textContent = arg.event.title;
                outer.appendChild(dot);
                outer.appendChild(title);
                if (chipLabel) {
                  const sub = document.createElement('span');
                  sub.className =
                    'ml-1 inline-flex items-center rounded px-1 text-[10px] leading-none text-slate-700';
                  sub.style.border = '1px solid ' + color + '66';
                  sub.style.whiteSpace = 'nowrap';
                  sub.style.overflow = 'hidden';
                  sub.style.textOverflow = 'ellipsis';
                  sub.textContent = chipLabel;
                  outer.appendChild(sub);
                  adjustChip(sub, outer, title);
                }
                return outer;
              })(),
            ],
          } as any;
        }}
        selectable
        editable
        eventResizableFromStart
        eventResize={(info: any) => {
          updateEvent(info.event.id, {
            startsAt: info.event.start?.toISOString(),
            endsAt: info.event.end?.toISOString(),
            allDay: info.event.allDay,
          } as any);
        }}
        eventDrop={(info: any) => {
          updateEvent(info.event.id, {
            startsAt: info.event.start?.toISOString(),
            endsAt: info.event.end?.toISOString(),
            allDay: info.event.allDay,
          } as any);
        }}
        select={(info: any) => {
          const initialCat = workCategoryId || (categories as any[])[0]?.id;
          setDraft({
            title: '',
            start: info.startStr,
            end: info.endStr,
            allDay: info.allDay,
            categoryId: initialCat,
            subcategoryId: null,
          });
          setDraftCategory(initialCat);
          setDraftSub(null);
        }}
        eventClick={(arg: any) => {
          const e = (events as any[]).find((x: any) => x.id === arg.event.id);
          if (!e) return;
          if (workCategoryId && e.categoryId === workCategoryId) {
            setKanbanEventId(e.id);
            return;
          }
          setDraft({
            id: e.id,
            title: e.title,
            start: e.startsAt,
            end: e.endsAt,
            allDay: e.allDay,
            categoryId: e.categoryId,
            subcategoryId: e.subcategoryId ?? null,
          });
          setDraftCategory(e.categoryId);
          setDraftSub(e.subcategoryId ?? null);
        }}
      />

      {quickAddOpen && (
        <>
          {/* Desktop header quick-add */}
          <div className="hidden md:block">
            <div className="absolute right-4 top-3 z-50" onKeyDown={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 shadow-sm">
                <input
                  className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder={todayLabel}
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickAdd();
                    if (e.key === 'Escape') setQuickAddOpen(false);
                  }}
                  autoFocus
                />
                <button
                  aria-label="추가"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
                  onClick={handleQuickAdd}
                >
                  ✓
                </button>
              </div>
            </div>
          </div>
          {/* Mobile bottom-sheet quick-add */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/30"
            onClick={() => setQuickAddOpen(false)}
          >
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t-2xl border border-slate-200 bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 text-sm font-medium text-slate-700">오늘 하루 일정 추가</div>
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-md border border-slate-200 bg-white/70 px-3 py-2 text-sm outline-none placeholder:text-slate-400"
                  placeholder={todayLabel}
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickAdd();
                    if (e.key === 'Escape') setQuickAddOpen(false);
                  }}
                  autoFocus
                />
                <button
                  aria-label="추가"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
                  onClick={handleQuickAdd}
                >
                  ✓
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile FAB for quick-add */}
      <button
        className="md:hidden fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg"
        aria-label="오늘 일정 추가"
        onClick={() => setQuickAddOpen(true)}
      >
        <Plus size={20} />
      </button>

      {draft && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setDraft(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setDraft(null);
          }}
          tabIndex={-1}
        >
          <div
            className="absolute left-1/2 top-20 w-[min(680px,94vw)] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-xl"
            onClick={(e: any) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h3 className="text-base font-semibold">{draft.id ? '일정 수정' : '일정 추가'}</h3>
              <button
                className="rounded-md p-1 text-slate-600 hover:bg-slate-100"
                onClick={() => setDraft(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-medium text-slate-600">제목</div>
                  <Input
                    placeholder="제목"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-slate-600">카테고리</div>
                  <Select
                    value={draftCategory}
                    onChange={(e) => {
                      setDraftCategory(e.target.value);
                      setDraftSub(null);
                    }}
                  >
                    {(categories as any[]).map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-medium text-slate-600">하위 카테고리</div>
                  <Select
                    value={draftSub ?? ''}
                    onChange={(e) => setDraftSub(e.target.value || null)}
                  >
                    <option value="">선택 안 함</option>
                    {(subsByCat[draftCategory] || []).map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="allDay"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={draft.allDay}
                    onChange={(e) => setDraft({ ...draft, allDay: e.target.checked })}
                  />
                  <label htmlFor="allDay" className="text-sm text-slate-700">
                    종일
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-medium text-slate-600">시작</div>
                  <input
                    type="datetime-local"
                    className="h-10 w-full rounded-md border border-slate-200 bg-white/70 px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={toLocalInputValue(draft.start)}
                    onChange={(e) => setDraft({ ...draft, start: inputValueToIso(e.target.value) })}
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-slate-600">종료</div>
                  <input
                    type="datetime-local"
                    className="h-10 w-full rounded-md border border-slate-200 bg-white/70 px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={toLocalInputValue(draft.end)}
                    onChange={(e) => setDraft({ ...draft, end: inputValueToIso(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t px-5 py-3">
              {draft.id ? (
                <Button
                  className="bg-red-500 hover:opacity-95 inline-flex items-center gap-1"
                  onClick={() => {
                    if (confirm('정말 삭제하시겠어요?')) {
                      removeEvent(draft.id as string);
                      setDraft(null);
                    }
                  }}
                >
                  <Trash2 size={16} /> 삭제
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-1 text-slate-800"
                  onClick={() => setDraft(null)}
                >
                  <X size={16} /> 취소
                </Button>
                <Button
                  className="inline-flex items-center gap-1"
                  onClick={() => {
                    if (!draft.title) return;
                    if (draft.id) {
                      updateEvent(draft.id, {
                        title: draft.title,
                        categoryId: draftCategory,
                        subcategoryId: draftSub,
                        startsAt: draft.start,
                        endsAt: draft.end,
                        allDay: draft.allDay,
                      } as any);
                      setDraft(null);
                      showToast('일정이 수정되었습니다', 'success');
                    } else {
                      addEvent({
                        title: draft.title,
                        description: '',
                        categoryId: draftCategory,
                        subcategoryId: draftSub,
                        startsAt: draft.start,
                        endsAt: draft.end,
                        allDay: draft.allDay,
                        location: '',
                      } as any);
                      setDraft(null);
                      showToast('일정이 추가되었습니다', 'success');
                    }
                  }}
                >
                  <Save size={16} /> 저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {kanbanEventId && (
        <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setKanbanEventId(null)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-2xl lg:max-w-3xl bg-white p-4"
            onClick={(e: any) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">업무 보드</h3>
                {kanbanEvent ? (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                    {kanbanEvent.title}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {kanbanEvent ? (
                  <button
                    className="rounded bg-slate-200 px-3 py-1 text-xs font-medium"
                    onClick={() =>
                      setKanbanEdit({
                        title: kanbanEvent.title,
                        start: kanbanEvent.startsAt,
                        end: kanbanEvent.endsAt,
                        allDay: kanbanEvent.allDay,
                        subcategoryId: kanbanEvent.subcategoryId ?? null,
                      })
                    }
                  >
                    편집
                  </button>
                ) : null}
                {kanbanEventId ? (
                  <button
                    className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white"
                    onClick={() => {
                      if (confirm('해당 업무 일정을 삭제할까요? 관련 Task도 함께 정리됩니다.')) {
                        removeEvent(kanbanEventId as string);
                        setKanbanEventId(null);
                      }
                    }}
                  >
                    일정 삭제
                  </button>
                ) : null}
                <button className="text-sm" onClick={() => setKanbanEventId(null)}>
                  닫기
                </button>
              </div>
            </div>
            {kanbanEvent && kanbanEdit && (
              <div className="mb-4 rounded-lg border bg-white p-3">
                <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <Input
                    placeholder="제목"
                    value={kanbanEdit.title}
                    onChange={(e) => setKanbanEdit({ ...kanbanEdit, title: e.target.value })}
                  />
                  <Select
                    value={kanbanEdit.subcategoryId ?? ''}
                    onChange={(e) =>
                      setKanbanEdit({ ...kanbanEdit, subcategoryId: e.target.value || null })
                    }
                  >
                    <option value="">하위 카테고리(선택)</option>
                    {(subsByCat[kanbanEvent.categoryId] || []).map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <input
                    type="datetime-local"
                    className="h-10 w-full rounded-md border border-slate-200 bg-white/70 px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={toLocalInputValue(kanbanEdit.start)}
                    onChange={(e) =>
                      setKanbanEdit({ ...kanbanEdit, start: inputValueToIso(e.target.value) })
                    }
                  />
                  <input
                    type="datetime-local"
                    className="h-10 w-full rounded-md border border-slate-200 bg-white/70 px-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
                    value={toLocalInputValue(kanbanEdit.end)}
                    onChange={(e) =>
                      setKanbanEdit({ ...kanbanEdit, end: inputValueToIso(e.target.value) })
                    }
                  />
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <input
                    id="kb-allDay"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={kanbanEdit.allDay}
                    onChange={(e) => setKanbanEdit({ ...kanbanEdit, allDay: e.target.checked })}
                  />
                  <label htmlFor="kb-allDay" className="text-sm text-slate-700">
                    종일
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    className="text-slate-800"
                    onClick={() => setKanbanEdit(null)}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={() => {
                      if (!kanbanEdit.title) return;
                      updateEvent(kanbanEvent.id, {
                        title: kanbanEdit.title,
                        subcategoryId: kanbanEdit.subcategoryId,
                        startsAt: kanbanEdit.start,
                        endsAt: kanbanEdit.end,
                        allDay: kanbanEdit.allDay,
                      } as any);
                      setKanbanEdit(null);
                      showToast('일정이 수정되었습니다', 'success');
                    }}
                  >
                    저장
                  </Button>
                </div>
              </div>
            )}
            <TaskBoard eventId={kanbanEventId} />
          </div>
        </div>
      )}
    </div>
  );
}
