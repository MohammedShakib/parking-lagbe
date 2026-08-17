import { NextResponse } from "next/server";

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

    // 1. Try RPC
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc("admin_get_analytics_summary");
      if (!rpcError && rpcData) {
        return NextResponse.json({ success: true, analytics: rpcData });
      }
    } catch {
      // Fallback
    }

    // 2. Fallback direct queries
    const { count: usersCount } = await supabase.from("account_information").select("*", { count: "exact", head: true });
    const { count: ownersCount } = await supabase.from("garage_owners").select("*", { count: "exact", head: true });
    const { count: garagesCount } = await supabase.from("garage_information").select("*", { count: "exact", head: true });
    const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true });
    const { count: pendingGarages } = await supabase.from("garage_information").select("*", { count: "exact", head: true }).eq("is_verified", false);

    const { data: payments } = await supabase.from("payments").select("amount").eq("payment_status", "paid");
    const totalGross = (payments || []).reduce((acc, p) => acc + (p.amount || 0), 0);
    const platformProfit = totalGross * 0.3;
    const ownerProfit = totalGross * 0.7;

    return NextResponse.json({
      success: true,
      analytics: {
        total_users: usersCount || 0,
        total_owners: ownersCount || 0,
        total_garages: garagesCount || 0,
        total_bookings: bookingsCount || 0,
        total_gross: totalGross,
        platform_profit: platformProfit,
        owner_profit: ownerProfit,
        pending_garages: pendingGarages || 0,
        pending_owners: 0,
        pending_users: 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching analytics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
