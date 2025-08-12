import { createClient } from "@supabase/supabase-js";

// Supabase client
// Lovable's Supabase integration injects credentials at runtime.
// We support both window-injected values and standard Vite env fallbacks if available.
const supabaseUrl = (window as any).__SUPABASE_URL__ || (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (window as any).__SUPABASE_ANON_KEY__ || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Non-fatal: UI will still render; admin features will warn.
  console.warn("Supabase credentials are not available. Ensure the project is connected to Supabase.");
}

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseAnonKey!) : (null as any);

export const ADMIN_EMAIL = "thetechfaculty@gmail.com";
