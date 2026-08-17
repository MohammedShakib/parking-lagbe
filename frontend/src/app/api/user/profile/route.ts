import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, address } = body;

    const supabase = await createSupabaseServerClient();

    const { error: updateError } = await supabase
      .from("personal_information")
      .update({
        first_name: firstName?.trim() || profile.first_name,
        last_name: lastName?.trim() || profile.last_name,
        phone: phone?.trim() || profile.phone,
        address: address?.trim() || profile.address,
      })
      .eq("username", profile.username);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
