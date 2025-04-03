import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ewvgbjsnxvmvghnshqnq.supabase.co';  // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3dmdianNueHZtdmdobnNocW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MTg3MzYsImV4cCI6MjA1ODI5NDczNn0.ySKyDGMuqFl9-CRef7HGuRp37XjLu6Ffh3MgiNgv5m8';  // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
