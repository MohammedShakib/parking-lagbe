import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { Database } from "./lib/supabase/database.types";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing (e.g. during initial setup), allow request to pass through
  if (!url || !anonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/admin");

  // If authenticated user is visiting auth routes (login/register), redirect to their dashboard
  if (user && isAuthRoute) {
    // Check if admin
    const isAdmin =
      user.user_metadata?.role === "admin" ||
      user.app_metadata?.role === "admin" ||
      user.email?.startsWith("admin@");

    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Lookup user's default_dashboard
    const { data: account } = await supabase
      .from("account_information")
      .select("default_dashboard, username")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (account?.username === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (account?.default_dashboard === "business") {
      return NextResponse.redirect(new URL("/business", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If unauthenticated user is trying to access protected routes, redirect to /login
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user tries to access /admin, verify admin privileges
  if (user && pathname.startsWith("/admin")) {
    const isAdmin =
      user.user_metadata?.role === "admin" ||
      user.app_metadata?.role === "admin" ||
      user.email?.startsWith("admin@");

    if (!isAdmin) {
      const { data: account } = await supabase
        .from("account_information")
        .select("username")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (account?.username !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
