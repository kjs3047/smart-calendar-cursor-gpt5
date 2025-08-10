'use client';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, CalendarClock, Plus } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { useLocalDb } from '@/components/providers/localdb-provider';
import type { TaskItem, TaskStatus } from '@/lib/types';

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: '할 일',
  IN_PROGRESS: '진행 중',
  BLOCKED: '차단됨',
  DONE: '완료',
};

export function TaskBoard({
  eventId,
  filter,
  onSchedule,
  enableAdd = true,
}: {
  eventId?: string | null;
  filter?: (t: TaskItem) => boolean;
  onSchedule?: (t: TaskItem) => void;
  enableAdd?: boolean;
}) {
  const { tasks, addTask, moveTask, updateTask, deleteTask, events } = useLocalDb() as any;
  const { showToast } = useToast();
  const [newTitle, setNewTitle] = useState('');
  const [editing, setEditing] = useState(null as { id: string; title: string } | null);

  // Ensure dragging item is rendered into a body-level portal to avoid
  // offset issues caused by transformed/filtered ancestors.
  const [portalEl, setPortalEl] = useState<Element | null>(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let el = document.getElementById('dnd-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dnd-portal';
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  const eventMap = useMemo(() => {
    const m: Record<string, any> = {};
    (events as any[]).forEach((e: any) => (m[e.id] = e));
    return m;
  }, [events]);

  const formatEventLabel = (e: any) => {
    if (!e) return '';
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

  const priorityLabel: Record<string, string> = {
    LOW: '낮음',
    NORMAL: '보통',
    HIGH: '높음',
    URGENT: '긴급',
  };
  const priorityTone: Record<string, any> = {
    LOW: 'slate',
    NORMAL: 'slate',
    HIGH: 'amber',
    URGENT: 'red',
  } as any;

  const byStatus = useMemo(() => {
    let filtered: any[] = eventId
      ? (tasks as any[]).filter((x: any) => x.eventId === eventId)
      : (tasks as any[]);
    if (filter) filtered = filtered.filter(filter as any);
    const map: Record<string, any[]> = { TODO: [], IN_PROGRESS: [], BLOCKED: [], DONE: [] };
    for (const it of filtered) map[it.status].push(it);
    for (const s of STATUSES) map[s].sort((a: any, b: any) => a.position - b.position);
    return map as any;
  }, [tasks, eventId, filter]);

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const fromStatus = source.droppableId as TaskStatus;
    const toStatus = destination.droppableId as TaskStatus;
    if (fromStatus === toStatus && source.index === destination.index) return;
    moveTask(draggableId, toStatus, destination.index);
    showToast('상태가 변경되었습니다', 'success');
  };

  const onAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    addTask({ title, status: 'TODO', position: 0, priority: 'NORMAL', eventId: eventId ?? null });
    setNewTitle('');
    showToast('할 일이 추가되었습니다', 'success');
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 kanban-no-transform">
      {enableAdd ? (
        <div className="md:col-span-4 mb-2 flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="할 일 추가"
            className="w-full rounded border px-3 py-2 text-sm"
          />
          <button
            onClick={onAdd}
            aria-label="추가"
            title="추가"
            className="inline-flex h-9 w-9 items-center justify-center rounded bg-primary p-0 text-white"
          >
            <Plus size={16} />
          </button>
        </div>
      ) : null}
      <DragDropContext onDragEnd={onDragEnd}>
        {STATUSES.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided: any, snapshot: any) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={
                  `min-h-[300px] rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur ` +
                  (snapshot.isDraggingOver ? 'ring-2 ring-primary/30' : '')
                }
              >
                <h3 className="mb-3 flex items-center justify-between text-sm font-semibold">
                  <span>{STATUS_LABEL[status]}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">
                    {(byStatus as any)[status].length}
                  </span>
                </h3>
                {(byStatus as any)[status].map((task: any, idx: number) => (
                  <Draggable draggableId={task.id} index={idx} key={task.id}>
                    {(prov: any, snapshot: any) => {
                      const content = (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className="mb-2 rounded-md border border-slate-200 bg-white/80 p-2 text-sm shadow-sm"
                        >
                          {editing?.id === task.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                className="w-full rounded border px-2 py-1"
                                value={(editing as any)?.title ?? ''}
                                onChange={(e) => setEditing({ id: task.id, title: e.target.value })}
                              />
                              <button
                                className="rounded bg-primary px-2 py-1 text-white"
                                onClick={() => {
                                  updateTask(task.id, {
                                    title: (editing as any)?.title ?? task.title,
                                  });
                                  setEditing(null);
                                }}
                              >
                                저장
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    {...prov.dragHandleProps}
                                    className="cursor-grab select-none text-slate-300"
                                  >
                                    ⋮⋮
                                  </span>
                                  <span>{task.title}</span>
                                </div>
                                <div className="flex gap-1">
                                  {onSchedule && !task.eventId ? (
                                    <Tooltip label="일정화">
                                      <button
                                        className="rounded bg-emerald-500 p-1 text-white"
                                        onClick={() => onSchedule(task)}
                                      >
                                        <CalendarClock size={16} />
                                      </button>
                                    </Tooltip>
                                  ) : null}
                                  <Tooltip label="편집">
                                    <button
                                      className="rounded bg-slate-200 p-1"
                                      onClick={() => setEditing({ id: task.id, title: task.title })}
                                    >
                                      <Pencil size={16} />
                                    </button>
                                  </Tooltip>
                                  <Tooltip label="삭제">
                                    <button
                                      className="rounded bg-red-500 p-1 text-white"
                                      onClick={() => deleteTask(task.id)}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </Tooltip>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                {task.eventId && eventMap[task.eventId] ? (
                                  <div className="text-[11px] text-slate-500">
                                    {formatEventLabel(eventMap[task.eventId])}
                                  </div>
                                ) : (
                                  <span />
                                )}
                                <Badge tone={priorityTone[task.priority]}>
                                  {priorityLabel[task.priority] || ''}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                      return snapshot.isDragging && portalEl
                        ? createPortal(content, portalEl)
                        : content;
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}
