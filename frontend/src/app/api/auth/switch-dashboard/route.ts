import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetDashboard } = await request.json();
    if (targetDashboard !== "user" && targetDashboard !== "business") {
      return NextResponse.json({ error: "Invalid target dashboard" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("account_information")
      .update({ default_dashboard: targetDashboard })
      .eq("auth_user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const redirectTo = targetDashboard === "business" ? "/business" : "/dashboard";
    return NextResponse.json({ success: true, redirectTo });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
