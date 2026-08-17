import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, garageId, rating, reviewText } = body;

    if (!bookingId || !garageId || !rating) {
      return NextResponse.json(
        { error: "Booking ID, garage ID, and star rating are required." },
        { status: 400 }
      );
    }

    const parsedRating = parseInt(rating, 10);
    if (parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5 stars." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Call RPC submit_garage_rating
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc("submit_garage_rating", {
        p_booking_id: parseInt(bookingId, 10),
        p_garage_id: garageId,
        p_rating: parsedRating,
        p_review_text: reviewText?.trim() || null,
      });

      if (rpcError) throw rpcError;
      return NextResponse.json(rpcResult);
    } catch {
      // Fallback direct insert
      await supabase.from("ratings").upsert({
        booking_id: parseInt(bookingId, 10),
        garage_id: garageId,
        rater_username: profile.username,
        rating: parsedRating,
        review_text: reviewText?.trim() || null,
      });

      return NextResponse.json({
        success: true,
        message: "Thank you for your rating and review!",
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error submitting rating";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
