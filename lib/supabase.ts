
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ppfetuyenedzwsfipuqc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZmV0dXllbmVkendzZmlwdXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5Mjc3MTAsImV4cCI6MjA4NjUwMzcxMH0.-4opIZCkBg931GmbKAmgrQ67nYt3-dM4qK9q6md1KLM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
