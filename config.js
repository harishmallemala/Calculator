// Supabase configuration
const SUPABASE_URL = 'https://dvddjqfbcxrzaiqqxehu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZGRqcWZiY3hyemFpcXF4ZWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MjQ4NTEsImV4cCI6MjA3NzMwMDg1MX0.V4dJHEW3iX2r_vlFsCoAEdFk_eE2n0dXAOgWKr4tD7Y';

// Initialize Supabase client
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
