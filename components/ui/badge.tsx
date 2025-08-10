'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'slate' | 'indigo' | 'amber' | 'red' | 'emerald';

export function Badge({
  children,
  tone = 'slate',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const toneClass: Record<Tone, string> = {
    slate: 'bg-slate-100 text-slate-600',
    indigo: 'bg-indigo-100 text-indigo-700',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium',
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
