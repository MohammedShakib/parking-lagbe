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
    const { data: transactions, error } = await supabase
      .from("points_transactions")
      .select("*")
      .eq("username", profile.username)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Compute tier progress
    const totalEarned = profile.total_earned_points || 0;
    let nextTier = "Gold";
    let pointsToNextTier = 300 - totalEarned;
    let progressPercent = Math.min(100, Math.round((totalEarned / 300) * 100));

    if (profile.user_level === "gold") {
      nextTier = "Diamond";
      pointsToNextTier = 1000 - totalEarned;
      progressPercent = Math.min(100, Math.round(((totalEarned - 300) / 700) * 100));
    } else if (profile.user_level === "diamond") {
      nextTier = "Max Tier (Diamond VIP)";
      pointsToNextTier = 0;
      progressPercent = 100;
    }

    return NextResponse.json({
      success: true,
      points: profile.points,
      total_earned: totalEarned,
      user_level: profile.user_level,
      tier_progress: {
        currentTier: profile.user_level,
        nextTier,
        pointsToNextTier: Math.max(0, pointsToNextTier),
        progressPercent,
      },
      transactions: transactions || [],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching points";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
