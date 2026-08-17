import { NextRequest, NextResponse } from "next/server";

import { createSafeSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawIdentifier = (body.identifier || body.username || "").trim();
    const password = body.password || "";
    const requestedRole = body.role;

    // Determine target role and default demo identity
    let role = requestedRole || "regular_user";
    let username = rawIdentifier || "demo_driver";
    let email = username.includes("@") ? username : `${username}@parkinglagbe.com`;
    let redirectTo = "/dashboard";

    const lowerId = (rawIdentifier || "").toLowerCase();
    if (requestedRole === "admin" || lowerId.includes("admin")) {
      role = "admin";
      username = rawIdentifier || "admin";
      email = "admin@parkinglagbe.com";
      redirectTo = "/admin";
    } else if (
      requestedRole === "garage_owner" ||
      lowerId.includes("owner") ||
      lowerId.includes("business") ||
      lowerId.includes("host")
    ) {
      role = "garage_owner";
      username = rawIdentifier || "demo_owner";
      email = "owner@parkinglagbe.com";
      redirectTo = "/business";
    } else {
      role = "regular_user";
      username = rawIdentifier || "demo_driver";
      email = rawIdentifier.includes("@") ? rawIdentifier : "driver@parkinglagbe.com";
      redirectTo = "/dashboard";
    }

    // Try Supabase auth if credentials are provided and Supabase is configured
    const supabase = await createSafeSupabaseServerClient();
    if (supabase && rawIdentifier && password) {
      try {
        let emailToAuth = rawIdentifier;
        if (!emailToAuth.includes("@")) {
          const { data: personal } = await supabase
            .from("personal_information")
            .select("email")
            .eq("username", emailToAuth)
            .maybeSingle();

          if (personal?.email) {
            emailToAuth = personal.email;
          } else if (emailToAuth === "admin") {
            emailToAuth = "admin@parkinglagbe.com";
          }
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: emailToAuth,
          password,
        });

        if (!authError && authData.user) {
          const user = authData.user;
          const { data: account } = await supabase
            .from("account_information")
            .select("username, default_dashboard")
            .eq("auth_user_id", user.id)
            .maybeSingle();

          username = account?.username || user.user_metadata?.username || rawIdentifier;
          const isAdmin =
            username === "admin" ||
            user.user_metadata?.role === "admin" ||
            user.app_metadata?.role === "admin" ||
            emailToAuth === "admin@parkinglagbe.com";

          if (isAdmin) {
            role = "admin";
            redirectTo = "/admin";
          } else if (account?.default_dashboard === "business") {
            role = "garage_owner";
            redirectTo = "/business";
          } else {
            role = "regular_user";
            redirectTo = "/dashboard";
          }
        }
      } catch {
        // Fallback to local demo login
      }
    }

    const response = NextResponse.json({
      success: true,
      redirectTo,
      role,
      user: {
        id: `local-${role}-${Date.now()}`,
        email,
        username,
      },
    });

    // Set demo session cookies for seamless instant login
    const cookieOptions = {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax" as const,
      httpOnly: false,
    };

    response.cookies.set("pl_demo_role", role, cookieOptions);
    response.cookies.set("pl_demo_username", username, cookieOptions);

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected login error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
