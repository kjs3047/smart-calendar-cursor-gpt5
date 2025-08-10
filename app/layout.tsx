import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { LocalDbProvider } from '@/components/providers/localdb-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { Noto_Sans_KR } from 'next/font/google';

const notoSans = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: 'Smart Calendar',
  description: 'Calendar + Tasks with categories and kanban, powered by local storage MVP',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Smart Calendar',
    description: 'Calendar + Tasks with categories and kanban',
    type: 'website',
    url: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={notoSans.className}>
        <LocalDbProvider>
          <ToastProvider>
            <div className="container-app py-6">{children}</div>
          </ToastProvider>
        </LocalDbProvider>
      </body>
    </html>
  );
}
