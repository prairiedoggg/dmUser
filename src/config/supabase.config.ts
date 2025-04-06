import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
export const supabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  key: process.env.SUPABASE_KEY || '',
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  },
};

// Supabase 클라이언트 생성 함수
export const createSupabaseClient = () => {
  const { url, key, options } = supabaseConfig;
  
  if (!url || !key) {
    throw new Error('Supabase URL and Key must be provided');
  }
  
  return createClient(url, key, options);
};

// 기본 Supabase 클라이언트 인스턴스
export const supabase = createSupabaseClient(); 