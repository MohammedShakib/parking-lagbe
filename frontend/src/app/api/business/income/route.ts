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

    // 1. Get summary via RPC
    let summary = {
      total_gross: 0,
      net_payout: 0,
      platform_commission: 0,
      today_income: 0,
      total_settled_bookings: 0,
    };

    try {
      const { data: rpcSummary, error: rpcError } = await supabase.rpc("get_owner_income_summary", {
        p_username: profile.username,
      });

      if (!rpcError && rpcSummary) {
        summary = rpcSummary as typeof summary;
      }
    } catch {
      // Fallback
    }

    // 2. Fetch profit_tracking list
    const { data: garages } = await supabase
      .from("garage_information")
      .select("garage_id")
      .eq("username", profile.username);

    const garageIds = (garages || []).map((g) => g.garage_id);

    let transactions: unknown[] = [];
    if (garageIds.length > 0) {
      const { data: pt } = await supabase
        .from("profit_tracking")
        .select("*")
        .in("garage_id", garageIds)
        .order("created_at", { ascending: false });

      transactions = pt || [];
    }

    return NextResponse.json({
      success: true,
      summary,
      transactions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching income analytics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
