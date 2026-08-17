import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseConfig } from "./env";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabaseConfig();

  return createBrowserClient(url, anonKey);
}
