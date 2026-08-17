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
    const { data: vehicles, error } = await supabase
      .from("vehicle_information")
      .select("*")
      .eq("username", profile.username)
      .order("license_plate", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, vehicles: vehicles || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching vehicles";
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
    const { licensePlate, vehicleType, make, model, color } = body;

    if (!licensePlate || !vehicleType) {
      return NextResponse.json(
        { error: "License plate and vehicle type are required." },
        { status: 400 }
      );
    }

    const cleanPlate = licensePlate.trim().toUpperCase();
    const supabase = await createSupabaseServerClient();

    // Check if plate already registered by this user or another
    const { data: existing } = await supabase
      .from("vehicle_information")
      .select("license_plate, username")
      .eq("license_plate", cleanPlate)
      .maybeSingle();

    if (existing) {
      if (existing.username === profile.username) {
        return NextResponse.json(
          { error: "You have already registered this vehicle." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "This license plate is already registered in the system." },
        { status: 409 }
      );
    }

    const { error: insertError } = await supabase.from("vehicle_information").insert({
      license_plate: cleanPlate,
      vehicle_type: vehicleType,
      make: make?.trim() || null,
      model: model?.trim() || null,
      color: color?.trim() || null,
      username: profile.username,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Vehicle added successfully!",
      vehicle: {
        license_plate: cleanPlate,
        vehicle_type: vehicleType,
        make,
        model,
        color,
        username: profile.username,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error adding vehicle";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const plate = searchParams.get("plate");

    if (!plate) {
      return NextResponse.json({ error: "License plate is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("vehicle_information")
      .delete()
      .eq("license_plate", plate)
      .eq("username", profile.username);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Vehicle removed successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting vehicle";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
