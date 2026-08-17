import { NextRequest, NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/auth";
import { OwnerAccountStatus, OwnerType } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: owners, error } = await supabase
      .from("garage_owners")
      .select("*")
      .order("registration_date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: commissions } = await supabase.from("owner_commissions").select("*");
    const { data: personals } = await supabase.from("personal_information").select("*");
    const { data: garages } = await supabase.from("garage_information").select("username, garage_id");

    const enriched = (owners || []).map((o) => {
      const comm = commissions?.find((c) => c.owner_id === o.owner_id);
      const p = personals?.find((pers) => pers.username === o.username);
      const garageCount = (garages || []).filter((g) => g.username === o.username).length;

      return {
        ...o,
        name: p ? `${p.first_name} ${p.last_name}` : o.username,
        email: p?.email || "N/A",
        phone: p?.phone || "N/A",
        commission_rate: comm?.rate || 30.0,
        garages_count: garageCount,
      };
    });

    return NextResponse.json({ success: true, owners: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching owners";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const { ownerId, isVerified, accountStatus, commissionRate, ownerType } = body;

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID is required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    if (isVerified !== undefined || accountStatus !== undefined) {
      const updates: {
        is_verified?: boolean;
        account_status?: OwnerAccountStatus;
      } = {};
      if (isVerified !== undefined) updates.is_verified = !!isVerified;
      if (accountStatus !== undefined) updates.account_status = accountStatus as OwnerAccountStatus;

      await supabase.from("garage_owners").update(updates).eq("owner_id", ownerId);
      await supabase.from("dual_user").update({
        is_verified: updates.is_verified,
        account_status: updates.account_status,
      }).eq("owner_id", ownerId);
    }

    if (commissionRate !== undefined) {
      const rate = parseFloat(commissionRate);
      await supabase.from("owner_commissions").upsert({
        owner_id: ownerId,
        owner_type: (ownerType as OwnerType) || "garage_owners",
        rate,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, message: `Owner ${ownerId} updated successfully.` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating owner";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
