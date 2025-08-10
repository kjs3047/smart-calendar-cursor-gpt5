'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LocalSignOutButton } from '@/components/auth/local-auth-buttons';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const linkBase = 'rounded-md px-3 py-1.5 font-medium';
  const linkActive = 'bg-slate-900 text-white';
  const linkIdle = 'hover:bg-slate-100';
  return (
    <div className="grid grid-cols-1 gap-6">
      <header className="flex items-center justify-between rounded-xl border bg-white/80 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/calendar"
            className={`${linkBase} ${pathname?.startsWith('/calendar') ? linkActive : linkIdle}`}
          >
            캘린더
          </Link>
          <Link
            href="/tasks"
            className={`${linkBase} ${pathname?.startsWith('/tasks') ? linkActive : linkIdle}`}
          >
            업무
          </Link>
          <Link
            href="/admin/categories"
            className={`${linkBase} ${pathname?.startsWith('/admin') ? linkActive : linkIdle}`}
          >
            관리자
          </Link>
        </div>
        <LocalSignOutButton />
      </header>
      <main>{children}</main>
    </div>
  );
}
