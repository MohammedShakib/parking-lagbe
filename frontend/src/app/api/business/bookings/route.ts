import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { BookingStatus } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();

    // 1. Get all garage_ids owned by this user
    const { data: myGarages, error: garageError } = await supabase
      .from("garage_information")
      .select("garage_id, parking_space_name, price_per_hour, parking_lot_address")
      .eq("username", profile.username);

    if (garageError) {
      return NextResponse.json({ error: garageError.message }, { status: 500 });
    }

    const garageIds = (myGarages || []).map((g) => g.garage_id);
    if (garageIds.length === 0) {
      return NextResponse.json({ success: true, bookings: [] });
    }

    // 2. Fetch bookings for these garages
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .in("garage_id", garageIds)
      .order("booking_date", { ascending: false });

    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    // 3. Fetch customer details
    const customerUsernames = Array.from(new Set((bookings || []).map((b) => b.username)));
    const { data: customers } = await supabase
      .from("personal_information")
      .select("username, first_name, last_name, phone, email")
      .in("username", customerUsernames);

    const { data: payments } = await supabase.from("payments").select("*");

    const enrichedBookings = (bookings || []).map((b) => {
      const garage = myGarages.find((g) => g.garage_id === b.garage_id);
      const customer = customers?.find((c) => c.username === b.username);
      const payment = payments?.find((p) => p.booking_id === b.id);
      const totalAmount = (garage?.price_per_hour || 50) * b.duration;

      return {
        ...b,
        garage_name: garage?.parking_space_name || "Parking Space",
        customer_name: customer ? `${customer.first_name} ${customer.last_name}` : b.username,
        customer_phone: customer?.phone || "N/A",
        total_amount: totalAmount,
        payment,
      };
    });

    return NextResponse.json({ success: true, bookings: enrichedBookings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching host bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, newStatus } = body;

    if (!bookingId || !newStatus) {
      return NextResponse.json(
        { error: "Booking ID and new status are required." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Call RPC update_host_booking_status
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc("update_host_booking_status", {
        p_booking_id: parseInt(bookingId, 10),
        p_new_status: newStatus as BookingStatus,
        p_username: profile.username,
      });

      if (rpcError) throw rpcError;
      return NextResponse.json(rpcResult);
    } catch {
      // Fallback update
      await supabase
        .from("bookings")
        .update({ status: newStatus as BookingStatus })
        .eq("id", parseInt(bookingId, 10));

      return NextResponse.json({
        success: true,
        message: `Booking updated to ${newStatus}.`,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating booking status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
