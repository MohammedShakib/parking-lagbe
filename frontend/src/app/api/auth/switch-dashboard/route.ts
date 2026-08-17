import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/auth";
import { createSafeSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { targetDashboard } = await request.json().catch(() => ({}));
    if (targetDashboard !== "user" && targetDashboard !== "business") {
      return NextResponse.json({ error: "Invalid target dashboard" }, { status: 400 });
    }

    const user = await getCurrentUser();
    const supabase = await createSafeSupabaseServerClient();
    if (supabase && user) {
      await supabase
        .from("account_information")
        .update({ default_dashboard: targetDashboard })
        .eq("auth_user_id", user.id);
    }

    const redirectTo = targetDashboard === "business" ? "/business" : "/dashboard";
    const response = NextResponse.json({ success: true, redirectTo });

    const newRole = targetDashboard === "business" ? "garage_owner" : "regular_user";
    response.cookies.set("pl_demo_role", newRole, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
