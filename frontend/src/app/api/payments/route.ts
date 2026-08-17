import { NextRequest, NextResponse } from "next/server";

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
    const { data: payments, error } = await supabase
      .from("payments")
      .select(`
        payment_id,
        booking_id,
        transaction_id,
        amount,
        payment_method,
        payment_status,
        payment_date,
        points_used
      `)
      .order("payment_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, payments: payments || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching payments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, paymentMethod, transactionId, amount, pointsUsed } = body;

    if (!bookingId || !paymentMethod) {
      return NextResponse.json(
        { error: "Booking ID and payment method are required." },
        { status: 400 }
      );
    }

    const numBookingId = parseInt(bookingId, 10);
    const parsedAmount = parseFloat(amount) || 0;
    const parsedPointsUsed = parseInt(pointsUsed, 10) || 0;
    const txn = transactionId || `TXN_${Date.now().toString(36).toUpperCase()}_${numBookingId}`;

    const supabase = await createSupabaseServerClient();

    // Try RPC process_booking_payment
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc("process_booking_payment", {
        p_booking_id: numBookingId,
        p_payment_method: paymentMethod,
        p_transaction_id: txn,
        p_amount: parsedAmount,
        p_points_used: parsedPointsUsed,
      });

      if (rpcError) throw rpcError;
      const res = rpcResult as { success: boolean; message: string; points_earned?: number };
      return NextResponse.json(res);
    } catch {
      // Fallback: direct table updates
      await supabase.from("payments").insert({
        booking_id: numBookingId,
        transaction_id: txn,
        amount: parsedAmount,
        payment_method: paymentMethod,
        payment_status: "paid",
        points_used: parsedPointsUsed,
      });

      await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          paid_with_points: parsedPointsUsed > 0,
          points_used: parsedPointsUsed,
        })
        .eq("id", numBookingId);

      const pointsEarned = Math.floor(parsedAmount / 10);
      return NextResponse.json({
        success: true,
        message: "Payment processed successfully! Your receipt is ready.",
        points_earned: pointsEarned,
        transaction_id: txn,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error processing payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
