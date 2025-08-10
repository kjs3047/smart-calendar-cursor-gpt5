'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  Category,
  DataSnapshot,
  EventItem,
  Subcategory,
  TaskItem,
  TaskStatus,
} from '@/lib/types';
import * as db from '@/lib/localdb';

interface LocalDbContextValue {
  ready: boolean;
  snap: DataSnapshot;
  categories: Category[];
  subcategories: Subcategory[];
  events: EventItem[];
  tasks: TaskItem[];
  // categories
  addCategory: (input: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, patch: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => { ok: boolean; reason?: string };
  addSubcategory: (input: Omit<Subcategory, 'id'>) => Subcategory;
  updateSubcategory: (id: string, patch: Partial<Omit<Subcategory, 'id' | 'categoryId'>>) => void;
  deleteSubcategory: (id: string) => void;
  // events
  addEvent: (input: Omit<EventItem, 'id'>) => EventItem;
  updateEvent: (id: string, patch: Partial<Omit<EventItem, 'id'>>) => void;
  removeEvent: (id: string) => void;
  // tasks
  addTask: (input: Omit<TaskItem, 'id' | 'position'>) => TaskItem;
  updateTask: (id: string, patch: Partial<Omit<TaskItem, 'id'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, nextStatus: TaskStatus, nextIndex: number) => void;
}

const LocalDbContext = createContext<LocalDbContextValue | null>(null);

export function LocalDbProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<DataSnapshot>({
    categories: [],
    subcategories: [],
    events: [],
    tasks: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = db.initLocalDb();
    setSnap(s);
    setReady(true);
  }, []);

  const value = useMemo<LocalDbContextValue>(
    () => ({
      ready,
      snap,
      categories: snap.categories,
      subcategories: snap.subcategories,
      events: snap.events,
      tasks: snap.tasks,
      addCategory: (input: any) => {
        const item = db.createCategory(input);
        setSnap(db.getSnapshot());
        return item;
      },
      updateCategory: (id: any, patch: any) => {
        db.updateCategory(id, patch);
        setSnap(db.getSnapshot());
      },
      deleteCategory: (id: any) => {
        const res = db.deleteCategory(id);
        setSnap(db.getSnapshot());
        return res;
      },
      addSubcategory: (input: any) => {
        const item = db.createSubcategory(input);
        setSnap(db.getSnapshot());
        return item;
      },
      updateSubcategory: (id: any, patch: any) => {
        db.updateSubcategory(id, patch);
        setSnap(db.getSnapshot());
      },
      deleteSubcategory: (id: any) => {
        db.deleteSubcategory(id);
        setSnap(db.getSnapshot());
      },
      addEvent: (input: any) => {
        const item = db.createEvent(input);
        setSnap(db.getSnapshot());
        return item;
      },
      updateEvent: (id: any, patch: any) => {
        db.updateEvent(id, patch);
        setSnap(db.getSnapshot());
      },
      removeEvent: (id: any) => {
        db.deleteEvent(id);
        setSnap(db.getSnapshot());
      },
      addTask: (input: any) => {
        const item = db.createTask(input);
        setSnap(db.getSnapshot());
        return item;
      },
      updateTask: (id: any, patch: any) => {
        db.updateTask(id, patch);
        setSnap(db.getSnapshot());
      },
      deleteTask: (id: any) => {
        db.deleteTask(id);
        setSnap(db.getSnapshot());
      },
      moveTask: (id: any, status: any, index: any) => {
        db.moveTask(id, status, index);
        setSnap(db.getSnapshot());
      },
    }),
    [snap, ready],
  );

  return <LocalDbContext.Provider value={value}>{children}</LocalDbContext.Provider>;
}

export function useLocalDb() {
  const ctx = useContext(LocalDbContext);
  if (!ctx) throw new Error('useLocalDb must be used within LocalDbProvider');
  return ctx;
}
