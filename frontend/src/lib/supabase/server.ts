import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { Database } from "./database.types";
import { getSupabaseConfig, requireSupabaseConfig } from "./env";

export async function createSupabaseServerClient() {
  const { url, anonKey } = requireSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components can read cookies, but writes belong in Server Actions or Route Handlers.
        }
      },
    },
  });
}

export async function createSafeSupabaseServerClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  try {
    const cookieStore = await cookies();
    return createServerClient<Database>(config.url, config.anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignored in read-only RSC contexts
          }
        },
      },
    });
  } catch {
    return null;
  }
}
