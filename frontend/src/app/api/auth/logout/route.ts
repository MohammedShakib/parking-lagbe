import { NextRequest, NextResponse } from "next/server";

import { createSafeSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSafeSupabaseServerClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
