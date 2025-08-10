'use client';

import { getBrowserSupabaseClient } from '@/lib/supabase';

export function GoogleSignInButton() {
  const supabase = getBrowserSupabaseClient();
  const onClick = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/calendar` },
    });
  };
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
    >
      Google로 시작
    </button>
  );
}

export function SignOutButton() {
  const supabase = getBrowserSupabaseClient();
  const onClick = async () => {
    await supabase.auth.signOut();
    location.href = '/';
  };
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-white hover:opacity-90"
    >
      로그아웃
    </button>
  );
}
