'use client';

import type { Category, DataSnapshot, EventItem, Subcategory, TaskItem, TaskStatus } from './types';

const STORAGE_KEY = 'smartcalendar:data:v1';

function read(): DataSnapshot | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DataSnapshot;
  } catch {
    return null;
  }
}

function write(data: DataSnapshot) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function initLocalDb() {
  const existing = read();
  if (existing) return existing;

  // Seed categories and subcategories
  const cat = (name: string, colorHex: string, sort = 0): Category => ({
    id: uuid(),
    name,
    colorHex,
    isActive: true,
    sortOrder: sort,
  });
  const sub = (
    categoryId: string,
    name: string,
    colorHex?: string | null,
    sort = 0,
  ): Subcategory => ({
    id: uuid(),
    categoryId,
    name,
    colorHex: colorHex ?? null,
    isActive: true,
    sortOrder: sort,
  });

  const cVacation = cat('휴가', '#22C55E', 1);
  const cWork = cat('업무', '#7C3AED', 2);
  const cMeeting = cat('미팅/회의', '#0EA5E9', 3);
  const cAnniv = cat('기념일', '#F59E0B', 4);

  const subs: Subcategory[] = [
    sub(cVacation.id, '연차'),
    sub(cVacation.id, '반차'),
    sub(cVacation.id, '반반차'),
    sub(cWork.id, '개발'),
    sub(cWork.id, '디자인'),
    sub(cWork.id, 'QA'),
    sub(cMeeting.id, '내부회의'),
    sub(cMeeting.id, '고객미팅'),
    sub(cAnniv.id, '생일'),
    sub(cAnniv.id, '결혼기념일'),
  ];

  // Seed events
  const now = new Date();
  const e1: EventItem = {
    id: uuid(),
    title: '팀 미팅',
    categoryId: cMeeting.id,
    subcategoryId: subs.find((s) => s.categoryId === cMeeting.id)?.id ?? null,
    startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(),
    endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
    allDay: false,
    description: '주간 플래닝',
    location: '',
  };
  const workEvent: EventItem = {
    id: uuid(),
    title: '개발 스프린트',
    categoryId: cWork.id,
    subcategoryId: subs.find((s) => s.categoryId === cWork.id && s.name === '개발')?.id ?? null,
    startsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(),
    endsAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0).toISOString(),
    allDay: false,
    location: '',
  };

  // Seed tasks for work event
  const tasks: TaskItem[] = [
    {
      id: uuid(),
      eventId: workEvent.id,
      title: '요구사항 정리',
      status: 'TODO',
      position: 0,
      priority: 'NORMAL',
    },
    {
      id: uuid(),
      eventId: workEvent.id,
      title: '캘린더 구현',
      status: 'IN_PROGRESS',
      position: 0,
      priority: 'HIGH',
    },
  ];

  const data: DataSnapshot = {
    categories: [cVacation, cWork, cMeeting, cAnniv],
    subcategories: subs,
    events: [e1, workEvent],
    tasks,
  };

  write(data);
  return data;
}

export function getSnapshot(): DataSnapshot {
  const s = read();
  return s ?? initLocalDb();
}

export function setSnapshot(next: DataSnapshot) {
  write(next);
}

// Category APIs
export function listCategories() {
  return getSnapshot().categories;
}
export function listSubcategories() {
  return getSnapshot().subcategories;
}
export function createCategory(input: Omit<Category, 'id'>) {
  const snap = getSnapshot();
  const item: Category = { id: uuid(), ...input };
  const next = { ...snap, categories: [...snap.categories, item] };
  setSnapshot(next);
  return item;
}
export function updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>) {
  const snap = getSnapshot();
  const next = {
    ...snap,
    categories: snap.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  };
  setSnapshot(next);
}
export function deleteCategory(id: string): { ok: boolean; reason?: string } {
  const snap = getSnapshot();
  const hasEvents = snap.events.some((e) => e.categoryId === id);
  if (hasEvents)
    return { ok: false, reason: '해당 카테고리를 사용하는 일정이 있어 삭제할 수 없습니다.' };
  const nextSub = snap.subcategories.filter((s) => s.categoryId !== id);
  const nextCat = snap.categories.filter((c) => c.id !== id);
  setSnapshot({ ...snap, categories: nextCat, subcategories: nextSub });
  return { ok: true };
}
export function createSubcategory(input: Omit<Subcategory, 'id'>) {
  const snap = getSnapshot();
  const item: Subcategory = { id: uuid(), ...input };
  setSnapshot({ ...snap, subcategories: [...snap.subcategories, item] });
  return item;
}
export function updateSubcategory(
  id: string,
  patch: Partial<Omit<Subcategory, 'id' | 'categoryId'>>,
) {
  const snap = getSnapshot();
  setSnapshot({
    ...snap,
    subcategories: snap.subcategories.map((s) => (s.id === id ? { ...s, ...patch } : s)),
  });
}
export function deleteSubcategory(id: string) {
  const snap = getSnapshot();
  const nextEvents = snap.events.map((e) =>
    e.subcategoryId === id ? { ...e, subcategoryId: null } : e,
  );
  const nextSubs = snap.subcategories.filter((s) => s.id !== id);
  setSnapshot({ ...snap, subcategories: nextSubs, events: nextEvents });
}

// Event APIs
export function listEvents(): EventItem[] {
  return getSnapshot().events;
}
export function createEvent(input: Omit<EventItem, 'id'>) {
  const snap = getSnapshot();
  const item: EventItem = { id: uuid(), ...input };
  setSnapshot({ ...snap, events: [...snap.events, item] });
  return item;
}
export function updateEvent(id: string, patch: Partial<Omit<EventItem, 'id'>>) {
  const snap = getSnapshot();
  setSnapshot({ ...snap, events: snap.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
}
export function deleteEvent(id: string) {
  const snap = getSnapshot();
  const nextTasks = snap.tasks.filter((t) => t.eventId !== id);
  setSnapshot({ ...snap, events: snap.events.filter((e) => e.id !== id), tasks: nextTasks });
}

// Task APIs
export function listTasksByEvent(eventId?: string | null): TaskItem[] {
  const all = getSnapshot().tasks;
  return eventId ? all.filter((t) => t.eventId === eventId) : all;
}
export function createTask(input: Omit<TaskItem, 'id' | 'position'>) {
  const snap = getSnapshot();
  const sameCol = snap.tasks.filter(
    (t) => t.status === input.status && t.eventId === input.eventId,
  );
  const item: TaskItem = { id: uuid(), position: sameCol.length, ...input };
  setSnapshot({ ...snap, tasks: [...snap.tasks, item] });
  return item;
}
export function updateTask(id: string, patch: Partial<Omit<TaskItem, 'id'>>) {
  const snap = getSnapshot();
  setSnapshot({ ...snap, tasks: snap.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
}
export function deleteTask(id: string) {
  const snap = getSnapshot();
  setSnapshot({ ...snap, tasks: snap.tasks.filter((t) => t.id !== id) });
}
export function moveTask(id: string, nextStatus: TaskStatus, nextIndex: number) {
  const snap = getSnapshot();
  const task = snap.tasks.find((t) => t.id === id);
  if (!task) return;
  const others = snap.tasks.filter((t) => t.id !== id);
  // Reposition in target column
  const target = others.filter((t) => t.status === nextStatus && t.eventId === task.eventId);
  target.splice(nextIndex, 0, { ...task, status: nextStatus });
  // Reassign positions
  const normalized = target.map((t, i) => ({ ...t, position: i }));
  const updated = others
    .filter((t) => !(t.status === nextStatus && t.eventId === task.eventId))
    .concat(normalized);
  setSnapshot({ ...snap, tasks: updated });
}
