import { NextRequest, NextResponse } from "next/server";

import { createSafeSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSafeSupabaseServerClient();
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }

    const redirectUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(redirectUrl, { status: 303 });

    response.cookies.delete("pl_demo_role");
    response.cookies.delete("pl_demo_username");

    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("pl_demo_role");
    response.cookies.delete("pl_demo_username");
    return response;
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
