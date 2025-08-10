'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-slate-200 bg-white/70 px-3 text-sm shadow-sm outline-none transition',
        'focus:ring-2 focus:ring-primary/30',
        className,
      )}
      {...props}
    />
  );
}
