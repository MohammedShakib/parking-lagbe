import { createBrowserClient } from "@supabase/ssr";

import { Database } from "./database.types";
import { getSupabaseConfig, requireSupabaseConfig } from "./env";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabaseConfig();

  return createBrowserClient<Database>(url, anonKey);
}

export function createSafeSupabaseBrowserClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  return createBrowserClient<Database>(config.url, config.anonKey);
}
