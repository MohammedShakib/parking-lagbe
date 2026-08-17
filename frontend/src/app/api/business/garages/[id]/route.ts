import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { data: garage, error } = await supabase
      .from("garage_information")
      .select("*")
      .eq("garage_id", id)
      .eq("username", profile.username)
      .maybeSingle();

    if (error || !garage) {
      return NextResponse.json({ error: "Garage not found" }, { status: 404 });
    }

    const { data: schedule } = await supabase
      .from("garage_operating_schedule")
      .select("*")
      .eq("garage_id", id)
      .maybeSingle();

    const { data: realTime } = await supabase
      .from("garage_real_time_status")
      .select("*")
      .eq("garage_id", id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      garage: {
        ...garage,
        schedule,
        real_time_status: realTime,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching garage";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { parkingSpaceName, parkingLotAddress, parkingType, parkingSpaceDimensions, parkingCapacity, pricePerHour } = body;

    const supabase = await createSupabaseServerClient();

    // Verify ownership
    const { data: existing } = await supabase
      .from("garage_information")
      .select("garage_id, username")
      .eq("garage_id", id)
      .eq("username", profile.username)
      .maybeSingle();

    if (!existing && profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized or garage not found" }, { status: 403 });
    }

    const updates: {
      updated_at?: string;
      parking_space_name?: string;
      parking_lot_address?: string;
      parking_type?: string;
      parking_space_dimensions?: string;
      parking_capacity?: number;
      price_per_hour?: number;
    } = {
      updated_at: new Date().toISOString(),
    };
    if (parkingSpaceName) updates.parking_space_name = parkingSpaceName.trim();
    if (parkingLotAddress) updates.parking_lot_address = parkingLotAddress.trim();
    if (parkingType) updates.parking_type = parkingType;
    if (parkingSpaceDimensions) updates.parking_space_dimensions = parkingSpaceDimensions;
    if (parkingCapacity) updates.parking_capacity = parseInt(parkingCapacity, 10);
    if (pricePerHour) updates.price_per_hour = parseFloat(pricePerHour);

    const { error: updateError } = await supabase
      .from("garage_information")
      .update(updates)
      .eq("garage_id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Garage details updated successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating garage";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("garage_information")
      .delete()
      .eq("garage_id", id)
      .eq("username", profile.username);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Parking space removed successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting garage";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
