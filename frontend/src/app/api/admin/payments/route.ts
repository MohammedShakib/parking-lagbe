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
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .order("payment_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: profits } = await supabase.from("profit_tracking").select("*");
    const { data: bookings } = await supabase.from("bookings").select("id, garage_id, license_plate, duration");

    const enriched = (payments || []).map((p) => {
      const profit = profits?.find((pt) => pt.payment_id === p.payment_id);
      const booking = bookings?.find((b) => b.id === p.booking_id);

      return {
        ...p,
        garage_id: booking?.garage_id || "N/A",
        license_plate: booking?.license_plate || "N/A",
        duration: booking?.duration || 1,
        platform_profit: profit?.platform_profit || p.amount * 0.3,
        owner_profit: profit?.owner_profit || p.amount * 0.7,
        commission_rate: profit?.commission_rate || 30.0,
      };
    });

    return NextResponse.json({ success: true, payments: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching platform payments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
