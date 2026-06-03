import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dummyproject.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-anon-key";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "[EDUFIN] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak diatur di .env.local. Fitur database akan gagal, tetapi login Demo tetap berfungsi."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
