import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://nswuxzfskvtlvshzaivc.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zd3V4emZza3Z0bHZzaHphaXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTQxNjMsImV4cCI6MjEwMzI5MDE2M30.1BWGyFaCJYgJJuYCQw2XPbSFfOdVQgswBxyLA8VNUkc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
