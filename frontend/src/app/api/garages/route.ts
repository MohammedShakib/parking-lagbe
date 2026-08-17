import { NextRequest, NextResponse } from "next/server";

import { createSafeSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const fallbackGarages = [
  {
    garage_id: "G_banani_hub",
    parking_space_name: "Banani Prime Parking Hub",
    parking_lot_address: "Road 11, Block D, Banani, Dhaka",
    parking_type: "Indoor",
    parking_space_dimensions: "Spacious (SUV / Sedan / Bike)",
    parking_capacity: 25,
    availability: 14,
    price_per_hour: 60,
    is_verified: true,
    latitude: 23.7937,
    longitude: 90.4043,
    average_rating: 4.8,
    total_ratings: 42,
    is_24_7: true,
  },
  {
    garage_id: "G_gulshan_square",
    parking_space_name: "Gulshan 2 Central Garage",
    parking_lot_address: "Gulshan Avenue, Circle 2, Dhaka",
    parking_type: "Covered",
    parking_space_dimensions: "Standard Car & EV Charging",
    parking_capacity: 40,
    availability: 8,
    price_per_hour: 80,
    is_verified: true,
    latitude: 23.7925,
    longitude: 90.4167,
    average_rating: 4.9,
    total_ratings: 68,
    is_24_7: true,
  },
  {
    garage_id: "G_dhanmondi_27",
    parking_space_name: "Dhanmondi 27 Safe Spot",
    parking_lot_address: "Old 27 (Rangs Fortune), Dhanmondi, Dhaka",
    parking_type: "Indoor",
    parking_space_dimensions: "Standard Sedan / Hatchback",
    parking_capacity: 18,
    availability: 6,
    price_per_hour: 50,
    is_verified: true,
    latitude: 23.7542,
    longitude: 90.3756,
    average_rating: 4.6,
    total_ratings: 29,
    is_24_7: false,
  },
  {
    garage_id: "G_uttara_sector3",
    parking_space_name: "Uttara Sector 3 Smart Garage",
    parking_lot_address: "Rabindra Sarani, Sector 3, Uttara, Dhaka",
    parking_type: "Outdoor",
    parking_space_dimensions: "All vehicle types",
    parking_capacity: 30,
    availability: 19,
    price_per_hour: 40,
    is_verified: true,
    latitude: 23.8759,
    longitude: 90.3795,
    average_rating: 4.7,
    total_ratings: 35,
    is_24_7: true,
  },
  {
    garage_id: "G_motijheel_biz",
    parking_space_name: "Motijheel C/A Business Parking",
    parking_lot_address: "Dilkusha C/A, Motijheel, Dhaka",
    parking_type: "Covered",
    parking_space_dimensions: "Sedan / Microbus",
    parking_capacity: 50,
    availability: 2,
    price_per_hour: 70,
    is_verified: true,
    latitude: 23.7330,
    longitude: 90.4172,
    average_rating: 4.5,
    total_ratings: 51,
    is_24_7: false,
  },
  {
    garage_id: "G_mirpur_10",
    parking_space_name: "Mirpur 10 Metro Park",
    parking_lot_address: "Near Metro Station, Mirpur 10, Dhaka",
    parking_type: "Indoor",
    parking_space_dimensions: "Car & Motorcycle",
    parking_capacity: 20,
    availability: 11,
    price_per_hour: 40,
    is_verified: true,
    latitude: 23.8071,
    longitude: 90.3687,
    average_rating: 4.6,
    total_ratings: 18,
    is_24_7: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;
    const type = searchParams.get("type");

    const supabase = await createSafeSupabaseServerClient();
    let garages: typeof fallbackGarages = [];

    if (supabase) {
      const { data: dbGarages, error } = await supabase
        .from("garage_information")
        .select(`
          garage_id,
          parking_space_name,
          parking_lot_address,
          parking_type,
          parking_space_dimensions,
          parking_capacity,
          availability,
          price_per_hour,
          is_verified
        `);

      if (!error && dbGarages && dbGarages.length > 0) {
        // Fetch ratings summary & coordinates
        const { data: summaries } = await supabase.from("garage_ratings_summary").select("*");
        const { data: locations } = await supabase.from("garagelocation").select("*");
        const { data: schedules } = await supabase.from("garage_operating_schedule").select("*");

        garages = dbGarages.map((g) => {
          const rating = summaries?.find((s) => s.garage_id === g.garage_id);
          const loc = locations?.find((l) => l.garage_id === g.garage_id);
          const sched = schedules?.find((sc) => sc.garage_id === g.garage_id);
          return {
            garage_id: g.garage_id,
            parking_space_name: g.parking_space_name,
            parking_lot_address: g.parking_lot_address,
            parking_type: g.parking_type || "Indoor",
            parking_space_dimensions: g.parking_space_dimensions || "Standard",
            parking_capacity: g.parking_capacity,
            availability: g.availability,
            price_per_hour: g.price_per_hour,
            is_verified: g.is_verified,
            latitude: loc?.latitude ? Number(loc.latitude) : 23.8103,
            longitude: loc?.longitude ? Number(loc.longitude) : 90.4125,
            average_rating: rating?.average_rating ? Number(rating.average_rating) : 5.0,
            total_ratings: rating?.total_ratings || 0,
            is_24_7: sched?.is_24_7 ?? true,
          };
        });
      }
    }

    if (garages.length === 0) {
      garages = fallbackGarages;
    }

    // Apply filtering
    let filtered = garages;
    if (query) {
      filtered = filtered.filter(
        (g) =>
          g.parking_space_name.toLowerCase().includes(query) ||
          g.parking_lot_address.toLowerCase().includes(query)
      );
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      filtered = filtered.filter((g) => g.price_per_hour <= maxPrice);
    }
    if (type && type !== "all") {
      filtered = filtered.filter((g) => g.parking_type.toLowerCase() === type.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      garages: filtered,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching garages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
