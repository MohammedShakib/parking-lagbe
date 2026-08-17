import { NextRequest, NextResponse } from "next/server";

import { createSafeSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSafeSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database client not available" },
        { status: 503 }
      );
    }

    const { data: garage, error } = await supabase
      .from("garage_information")
      .select("*")
      .eq("garage_id", id)
      .maybeSingle();

    if (error || !garage) {
      return NextResponse.json({ error: "Garage not found" }, { status: 404 });
    }

    // Supplementary data
    const { data: schedule } = await supabase
      .from("garage_operating_schedule")
      .select("*")
      .eq("garage_id", id)
      .maybeSingle();

    const { data: realTime } = await supabase
      .from("garage_real_time_status")
      .select("*")
      .eq("garage_id", id)
      .maybeSingle();

    const { data: location } = await supabase
      .from("garagelocation")
      .select("*")
      .eq("garage_id", id)
      .maybeSingle();

    const { data: ratings } = await supabase
      .from("ratings")
      .select("*")
      .eq("garage_id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: summary } = await supabase
      .from("garage_ratings_summary")
      .select("*")
      .eq("garage_id", id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      garage: {
        ...garage,
        schedule,
        real_time_status: realTime,
        location,
        ratings: ratings || [],
        summary,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching garage details";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
