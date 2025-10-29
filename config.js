// Supabase configuration
// These environment variables should be set in your Vercel project settings
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
