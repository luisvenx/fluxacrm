
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

// Fallback to avoid crash during build or if env vars are missing
export const supabase = createClient(
  supabaseUrl || 'https://wxjhrzxuhnmnqeibdwkk.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4amhyenh1aG5tbnFlaWJkd2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTI4OTYsImV4cCI6MjA4ODEyODg5Nn0.Q9Nq16UDX6Me81k0RHrFy5W20SIAKnwl73vLUv-ipP4'
);
