import { createClient } from '@supabase/supabase-js';

// These should be set in a .env file for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Auth and database features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
