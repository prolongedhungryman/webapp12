import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://tnaczmynxmhqjrzuuyto.supabase.co';

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYWN6bXlueG1ocWpyenV1eXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDU1MzMsImV4cCI6MjEwMjUyMTUzM30.lOlJnVVHJ1xKiDAwNKYooIqPeG6855GMIPIHGXGVeDw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });
    return !error && count !== null;
  } catch (err) {
    console.warn('Supabase connection check failed:', err);
    return false;
  }
};
