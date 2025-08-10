import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
};

export function getBrowserSupabaseClient(): SupabaseClient {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, anonKey);
}

// NOTE: 서버 측에서 쿠키 기반 세션 연동/서비스 롤 사용은 이후 단계에서 보강합니다.
export function getServerSupabaseClient(): SupabaseClient {
  const url = getEnv('SUPABASE_URL');
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
}
