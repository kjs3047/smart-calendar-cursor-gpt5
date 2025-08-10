'use client';

import React from 'react';

export function Empty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-slate-200 bg-white/60 px-3 py-6 text-center">
      <div className="text-sm font-medium text-slate-700">{title}</div>
      {description ? <div className="text-xs text-slate-500">{description}</div> : null}
    </div>
  );
}
