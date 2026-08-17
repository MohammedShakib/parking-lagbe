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
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        username,
        garage_id,
        license_plate,
        booking_date,
        booking_time,
        duration,
        status,
        payment_status,
        created_at,
        paid_with_points,
        points_used
      `)
      .eq("username", profile.username)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Attach garage details, payments, and ratings
    const { data: garages } = await supabase.from("garage_information").select("*");
    const { data: payments } = await supabase.from("payments").select("*");
    const { data: ratings } = await supabase
      .from("ratings")
      .select("*")
      .eq("rater_username", profile.username);

    const enrichedBookings = (bookings || []).map((b) => {
      const garage = garages?.find((g) => g.garage_id === b.garage_id);
      const payment = payments?.find((p) => p.booking_id === b.id);
      const rating = ratings?.find((r) => r.booking_id === b.id);

      const pricePerHour = garage?.price_per_hour || 50;
      const totalCost = pricePerHour * b.duration;

      return {
        ...b,
        garage_name: garage?.parking_space_name || "Parking Space",
        garage_address: garage?.parking_lot_address || "Dhaka, Bangladesh",
        price_per_hour: pricePerHour,
        total_amount: totalCost,
        payment,
        rating,
      };
    });

    return NextResponse.json({ success: true, bookings: enrichedBookings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching bookings";
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
    const { garageId, licensePlate, bookingDate, bookingTime, duration, paidWithPoints, pointsUsed } = body;

    if (!garageId || !licensePlate || !bookingDate || !bookingTime || !duration) {
      return NextResponse.json(
        { error: "All booking details (garage, vehicle, date, time, duration) are required." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Call RPC create_booking_order
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc("create_booking_order", {
        p_username: profile.username,
        p_garage_id: garageId,
        p_license_plate: licensePlate,
        p_booking_date: bookingDate,
        p_booking_time: bookingTime,
        p_duration: parseInt(duration, 10),
        p_paid_with_points: !!paidWithPoints,
        p_points_used: parseInt(pointsUsed, 10) || 0,
      });

      if (rpcError) {
        throw rpcError;
      }

      const res = rpcResult as { success: boolean; message: string; booking_id?: number };
      if (!res.success) {
        return NextResponse.json({ error: res.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: res.message,
        bookingId: res.booking_id,
      });
    } catch {
      // Fallback direct insert if RPC not yet loaded
      const { data: newBooking, error: insertError } = await supabase
        .from("bookings")
        .insert({
          username: profile.username,
          garage_id: garageId,
          license_plate: licensePlate,
          booking_date: bookingDate,
          booking_time: bookingTime,
          duration: parseInt(duration, 10),
          status: "upcoming",
          payment_status: "pending",
          paid_with_points: !!paidWithPoints,
          points_used: parseInt(pointsUsed, 10) || 0,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Booking reserved successfully!",
        bookingId: newBooking?.id,
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
