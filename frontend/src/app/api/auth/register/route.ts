import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      username,
      password,
      isGarageOwner,
      garageDetails,
    } = body;

    // Basic Validations
    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: "First name, last name, email, username, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    const supabase = await createSupabaseServerClient();

    // Check if username already exists in account_information
    const { data: existingUser } = await supabase
      .from("account_information")
      .select("username")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: `Username '${cleanUsername}' is already taken. Please choose another.` },
        { status: 409 }
      );
    }

    // Check if email already exists in personal_information
    const { data: existingEmail } = await supabase
      .from("personal_information")
      .select("email")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { error: `Email '${cleanEmail}' is already registered. Please log in instead.` },
        { status: 409 }
      );
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          username: cleanUsername,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          role: isGarageOwner ? "garage_owner" : "regular_user",
        },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to create authentication account." },
        { status: 400 }
      );
    }

    const authUserId = authData.user.id;
    const defaultDashboard = isGarageOwner ? "business" : "user";
    const ownerId = isGarageOwner ? `G_owner_${cleanUsername}` : null;

    // 2. Insert into account_information
    const { error: accountError } = await supabase.from("account_information").insert({
      username: cleanUsername,
      auth_user_id: authUserId,
      status: "unverified",
      owner_id: ownerId,
      default_dashboard: defaultDashboard,
      points: 0,
      user_level: "bronze",
      total_earned_points: 0,
    });

    if (accountError) {
      return NextResponse.json(
        { error: `Failed to create user account profile: ${accountError.message}` },
        { status: 500 }
      );
    }

    // 3. Insert into personal_information
    const { error: personalError } = await supabase.from("personal_information").insert({
      email: cleanEmail,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      username: cleanUsername,
    });

    if (personalError) {
      return NextResponse.json(
        { error: `Failed to save personal profile: ${personalError.message}` },
        { status: 500 }
      );
    }

    // 4. If Garage Owner, create garage owner and initial garage info
    if (isGarageOwner && ownerId) {
      // Insert into garage_owners
      const { error: ownerError } = await supabase.from("garage_owners").insert({
        owner_id: ownerId,
        username: cleanUsername,
        is_verified: false,
        account_status: "active",
      });

      if (ownerError) {
        return NextResponse.json(
          { error: `Failed to register garage owner profile: ${ownerError.message}` },
          { status: 500 }
        );
      }

      // If garage details are provided in registration
      if (garageDetails && garageDetails.garageName) {
        const garageId = `G_${cleanUsername}_${Date.now().toString(36)}`;
        const lat = parseFloat(garageDetails.latitude) || 23.8103;
        const lng = parseFloat(garageDetails.longitude) || 90.4125;

        // Insert location
        await supabase.from("garagelocation").insert({
          garage_id: garageId,
          latitude: lat,
          longitude: lng,
          username: cleanUsername,
        });

        // Insert garage information
        await supabase.from("garage_information").insert({
          garage_id: garageId,
          username: cleanUsername,
          parking_space_name: garageDetails.garageName,
          parking_lot_address: garageDetails.parkingLotAddress || address || "Dhaka, Bangladesh",
          parking_type: garageDetails.parkingType || "Indoor",
          parking_space_dimensions: garageDetails.parkingDimensions || "Standard",
          parking_capacity: parseInt(garageDetails.garageSlots, 10) || 5,
          availability: parseInt(garageDetails.garageSlots, 10) || 5,
          price_per_hour: parseFloat(garageDetails.pricePerHour) || 50,
          is_verified: false,
        });

        // Insert operating schedule
        await supabase.from("garage_operating_schedule").insert({
          garage_id: garageId,
          garage_name: garageDetails.garageName,
          is_24_7: true,
          operating_days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        });

        // Insert real-time status
        await supabase.from("garage_real_time_status").insert({
          garage_id: garageId,
          current_status: "available",
        });
      }
    }

    const redirectTo = isGarageOwner ? "/business" : "/dashboard";

    return NextResponse.json({
      success: true,
      redirectTo,
      message: "Account created successfully!",
      user: {
        id: authUserId,
        email: cleanEmail,
        username: cleanUsername,
        role: isGarageOwner ? "garage_owner" : "regular_user",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected registration error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
