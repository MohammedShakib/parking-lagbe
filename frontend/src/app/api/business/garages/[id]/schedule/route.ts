import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { GarageStatus } from "@/lib/supabase/database.types";
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
    const body = await request.json();
    const {
      parkingSpaceName,
      parkingCapacity,
      pricePerHour,
      is24_7,
      openingTime,
      closingTime,
      operatingDays,
      currentStatus,
      isManualOverride,
      overrideReason,
      forceClosed,
    } = body;

    const supabase = await createSupabaseServerClient();

    // Call RPC update_garage_schedule_and_status
    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc("update_garage_schedule_and_status", {
        p_garage_id: id,
        p_username: profile.username,
        p_space_name: parkingSpaceName || "Parking Space",
        p_capacity: parseInt(parkingCapacity, 10) || 5,
        p_price_per_hour: parseFloat(pricePerHour) || 50,
        p_is_24_7: !!is24_7,
        p_opening_time: is24_7 ? null : (openingTime ? `${openingTime}:00` : "06:00:00"),
        p_closing_time: is24_7 ? null : (closingTime ? `${closingTime}:00` : "22:00:00"),
        p_operating_days: operatingDays || [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        p_current_status: (currentStatus as GarageStatus) || "available",
        p_is_manual_override: !!isManualOverride,
        p_override_reason: overrideReason || null,
        p_force_closed: !!forceClosed,
      });

      if (rpcError) throw rpcError;
      return NextResponse.json(rpcResult);
    } catch {
      // Direct update fallback
      await supabase
        .from("garage_real_time_status")
        .update({
          current_status: (currentStatus as GarageStatus) || "available",
          is_manual_override: !!isManualOverride,
          override_reason: overrideReason || null,
          force_closed: !!forceClosed,
          last_changed_at: new Date().toISOString(),
          changed_by: profile.username,
        })
        .eq("garage_id", id);

      return NextResponse.json({
        success: true,
        message: "Garage schedule and real-time status updated successfully.",
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating garage schedule";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
