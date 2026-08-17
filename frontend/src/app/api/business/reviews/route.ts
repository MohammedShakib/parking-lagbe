import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();

    // 1. Get host garages
    const { data: garages } = await supabase
      .from("garage_information")
      .select("garage_id, parking_space_name")
      .eq("username", profile.username);

    const garageIds = (garages || []).map((g) => g.garage_id);
    if (garageIds.length === 0) {
      return NextResponse.json({ success: true, reviews: [], summaries: [] });
    }

    // 2. Fetch reviews
    const { data: reviews, error } = await supabase
      .from("ratings")
      .select("*")
      .in("garage_id", garageIds)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Fetch summaries
    const { data: summaries } = await supabase
      .from("garage_ratings_summary")
      .select("*")
      .in("garage_id", garageIds);

    return NextResponse.json({
      success: true,
      reviews: reviews || [],
      summaries: summaries || [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching host reviews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
