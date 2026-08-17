import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid booking ID" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Verify ownership
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("id, username, status")
      .eq("id", bookingId)
      .maybeSingle();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.username !== profile.username && profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized to cancel this booking" }, { status: 403 });
    }

    // Try RPC cancel_booking_order
    try {
      const { data: result, error: rpcError } = await supabase.rpc("cancel_booking_order", {
        p_booking_id: bookingId,
      });

      if (rpcError) throw rpcError;
      const res = result as { success: boolean; message: string };
      return NextResponse.json(res);
    } catch {
      // Fallback
      await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId);

      return NextResponse.json({ success: true, message: "Booking cancelled successfully." });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error cancelling booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
