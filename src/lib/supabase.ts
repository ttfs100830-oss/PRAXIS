import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? "";
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";

function looksConfigured(value: string): boolean {
  return Boolean(value) && !value.includes("YOUR_") && !value.includes("PASTE_");
}

export const supabaseConfigured = looksConfigured(url) && looksConfigured(publishableKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "praxis-auth",
      },
    })
  : null;

export const supabaseProjectUrl = url;
