import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { Database } from "./lib/supabase/database.types";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const demoRole = request.cookies.get("pl_demo_role")?.value;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/admin");

  // If local demo session is active
  if (demoRole) {
    if (isAuthRoute) {
      if (demoRole === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (demoRole === "garage_owner") {
        return NextResponse.redirect(new URL("/business", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/admin") && demoRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing and no demo session, allow requests through
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

  // If authenticated user is visiting auth routes (login/register), redirect to their dashboard
  if (user && isAuthRoute) {
    const isAdmin =
      user.user_metadata?.role === "admin" ||
      user.app_metadata?.role === "admin" ||
      user.email?.startsWith("admin@");

    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

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
  if (!user && isProtectedRoute && !demoRole) {
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
