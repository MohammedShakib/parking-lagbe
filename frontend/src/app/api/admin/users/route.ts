import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { AccountStatus, UserLevel } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: accounts, error: accountError } = await supabase
      .from("account_information")
      .select("*")
      .order("registration_date", { ascending: false });

    if (accountError) {
      return NextResponse.json({ error: accountError.message }, { status: 500 });
    }

    const { data: personals } = await supabase.from("personal_information").select("*");

    const users = (accounts || []).map((acc) => {
      const p = personals?.find((pers) => pers.username === acc.username);
      return {
        username: acc.username,
        email: p?.email || "N/A",
        name: p ? `${p.first_name} ${p.last_name}` : acc.username,
        phone: p?.phone || "N/A",
        status: acc.status,
        points: acc.points,
        user_level: acc.user_level,
        registration_date: acc.registration_date,
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { username, newStatus, points, userLevel } = body;

    if (!username) {
      return NextResponse.json({ error: "Username is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const updates: {
      status?: AccountStatus;
      points?: number;
      user_level?: UserLevel;
      level_updated_at?: string;
    } = {};

    if (newStatus) updates.status = newStatus as AccountStatus;
    if (points !== undefined) updates.points = parseInt(points, 10);
    if (userLevel) {
      updates.user_level = userLevel as UserLevel;
      updates.level_updated_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("account_information")
      .update(updates)
      .eq("username", username);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `User @${username} updated successfully.` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
