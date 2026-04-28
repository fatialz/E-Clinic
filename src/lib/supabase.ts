/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
      console.warn('Supabase URL or Anon Key is missing. Database features will be limited.');
    }
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
};

// For backward compatibility with existing imports, but recommended to use getSupabase()
export const supabase = (function() {
    if (!supabaseUrl || !supabaseAnonKey) return null as any;
    return createClient(supabaseUrl, supabaseAnonKey);
})();
