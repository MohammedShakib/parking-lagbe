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
    const { data: garages, error } = await supabase
      .from("garage_information")
      .select("*")
      .eq("username", profile.username)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Attach supplementary details for each garage
    const { data: schedules } = await supabase.from("garage_operating_schedule").select("*");
    const { data: realTimeStatuses } = await supabase.from("garage_real_time_status").select("*");
    const { data: summaries } = await supabase.from("garage_ratings_summary").select("*");
    const { data: locations } = await supabase.from("garagelocation").select("*");

    const enrichedGarages = (garages || []).map((g) => {
      const schedule = schedules?.find((s) => s.garage_id === g.garage_id);
      const realTime = realTimeStatuses?.find((r) => r.garage_id === g.garage_id);
      const summary = summaries?.find((sm) => sm.garage_id === g.garage_id);
      const location = locations?.find((l) => l.garage_id === g.garage_id);

      return {
        ...g,
        schedule,
        real_time_status: realTime || { current_status: "available", is_manual_override: false },
        summary: summary || { average_rating: 5.0, total_ratings: 0 },
        location,
      };
    });

    return NextResponse.json({ success: true, garages: enrichedGarages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching garages";
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
    const {
      parkingSpaceName,
      parkingLotAddress,
      parkingType,
      parkingSpaceDimensions,
      parkingCapacity,
      pricePerHour,
      latitude,
      longitude,
      is24_7,
      openingTime,
      closingTime,
      operatingDays,
    } = body;

    if (!parkingSpaceName || !parkingLotAddress || !parkingCapacity || !pricePerHour) {
      return NextResponse.json(
        { error: "Name, address, capacity, and price per hour are required." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const garageId = `G_${profile.username}_${Date.now().toString(36)}`;
    const parsedCapacity = parseInt(parkingCapacity, 10) || 5;
    const parsedPrice = parseFloat(pricePerHour) || 50;
    const lat = parseFloat(latitude) || 23.8103;
    const lng = parseFloat(longitude) || 90.4125;

    // Ensure owner record exists in garage_owners or dual_user
    const { data: ownerCheck } = await supabase
      .from("garage_owners")
      .select("owner_id")
      .eq("username", profile.username)
      .maybeSingle();

    if (!ownerCheck) {
      const ownerId = `G_owner_${profile.username}`;
      await supabase.from("garage_owners").insert({
        owner_id: ownerId,
        username: profile.username,
        is_verified: false,
        account_status: "active",
      });

      await supabase
        .from("account_information")
        .update({ owner_id: ownerId, default_dashboard: "business" })
        .eq("username", profile.username);
    }

    // 1. Insert garagelocation
    await supabase.from("garagelocation").insert({
      garage_id: garageId,
      latitude: lat,
      longitude: lng,
      username: profile.username,
    });

    // 2. Insert garage_information
    const { error: garageError } = await supabase.from("garage_information").insert({
      garage_id: garageId,
      username: profile.username,
      parking_space_name: parkingSpaceName.trim(),
      parking_lot_address: parkingLotAddress.trim(),
      parking_type: parkingType || "Indoor",
      parking_space_dimensions: parkingSpaceDimensions || "Standard",
      parking_capacity: parsedCapacity,
      availability: parsedCapacity,
      price_per_hour: parsedPrice,
      is_verified: false,
    });

    if (garageError) {
      return NextResponse.json({ error: garageError.message }, { status: 500 });
    }

    // 3. Insert garage_operating_schedule
    await supabase.from("garage_operating_schedule").insert({
      garage_id: garageId,
      garage_name: parkingSpaceName.trim(),
      opening_time: is24_7 ? null : (openingTime ? `${openingTime}:00` : "06:00:00"),
      closing_time: is24_7 ? null : (closingTime ? `${closingTime}:00` : "22:00:00"),
      operating_days: operatingDays || [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      is_24_7: !!is24_7,
    });

    // 4. Insert garage_real_time_status
    await supabase.from("garage_real_time_status").insert({
      garage_id: garageId,
      current_status: "available",
      is_manual_override: false,
      changed_by: profile.username,
    });

    return NextResponse.json({
      success: true,
      message: "Parking space registered successfully!",
      garageId,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error creating parking space";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
