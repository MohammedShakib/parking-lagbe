import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/Email and Password are required." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    let emailToAuth = identifier.trim();

    // If identifier is a username (no @ symbol), lookup the email
    if (!emailToAuth.includes("@")) {
      const { data: personal } = await supabase
        .from("personal_information")
        .select("email")
        .eq("username", emailToAuth)
        .maybeSingle();

      if (personal && personal.email) {
        emailToAuth = personal.email;
      } else {
        // Check if it's admin username without email suffix
        if (emailToAuth === "admin") {
          emailToAuth = "admin@parkinglagbe.com";
        }
      }
    }

    // Attempt Supabase Auth Sign In
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password: password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Invalid credentials. Please check your username/email and password." },
        { status: 401 }
      );
    }

    const user = authData.user;

    // Lookup user's account information & role
    const { data: account } = await supabase
      .from("account_information")
      .select("username, default_dashboard")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    const username = account?.username || user.user_metadata?.username || identifier;

    // Record login history
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || null;
    const userAgent = request.headers.get("user-agent") || null;

    try {
      await supabase.rpc("record_login_history", {
        p_username: username,
        p_ip: ip,
        p_user_agent: userAgent,
      });
    } catch {
      // Non-blocking fallback
      await supabase.from("user_login_history").insert({
        username,
        user_agent: userAgent,
      });
    }

    // Determine redirect destination
    let redirectTo = "/dashboard";
    const isAdmin =
      username === "admin" ||
      user.user_metadata?.role === "admin" ||
      user.app_metadata?.role === "admin" ||
      emailToAuth === "admin@parkinglagbe.com";

    if (isAdmin) {
      redirectTo = "/admin";
    } else if (account?.default_dashboard === "business") {
      redirectTo = "/business";
    }

    return NextResponse.json({
      success: true,
      redirectTo,
      user: {
        id: user.id,
        email: user.email,
        username,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected login error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
