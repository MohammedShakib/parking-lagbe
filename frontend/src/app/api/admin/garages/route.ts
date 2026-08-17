import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: garages, error } = await supabase
      .from("garage_information")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: summaries } = await supabase.from("garage_ratings_summary").select("*");
    const { data: realTimeStatuses } = await supabase.from("garage_real_time_status").select("*");

    const enriched = (garages || []).map((g) => {
      const summary = summaries?.find((s) => s.garage_id === g.garage_id);
      const realTime = realTimeStatuses?.find((r) => r.garage_id === g.garage_id);
      return {
        ...g,
        summary: summary || { average_rating: 5.0, total_ratings: 0 },
        real_time_status: realTime || { current_status: "available" },
      };
    });

    return NextResponse.json({ success: true, garages: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching garages";
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
    const { garageId, isVerified } = body;

    if (!garageId) {
      return NextResponse.json({ error: "Garage ID is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("garage_information")
      .update({ is_verified: !!isVerified, updated_at: new Date().toISOString() })
      .eq("garage_id", garageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Garage ${garageId} verification status set to ${isVerified ? "Verified" : "Unverified"}.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating garage verification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
