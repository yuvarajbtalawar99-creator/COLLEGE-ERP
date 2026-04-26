import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
const missingEnvMessage = 'Supabase environment variables are missing. Create College-ERP-Frontend/.env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';

export const supabase = hasSupabaseEnv ? createClient(supabaseUrl, supabaseAnonKey) : null;
export const supabaseConfigError = hasSupabaseEnv ? null : missingEnvMessage;
