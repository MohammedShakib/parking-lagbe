"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { BookingModal } from "./booking-modal";

export interface GarageItem {
  id: number;
  garage_id: string;
  parking_space_name: string;
  parking_lot_address: string;
  parking_type: string | null;
  parking_capacity: number;
  availability: number;
  price_per_hour: number;
  is_verified: boolean;
  schedule?: {
    is_24_7: boolean;
    opening_time: string | null;
    closing_time: string | null;
  };
  summary?: {
    average_rating: number;
    total_ratings: number;
  };
}

export function GarageSearch() {
  const [garages, setGarages] = useState<GarageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("All Areas");
  const [selectedGarageForBooking, setSelectedGarageForBooking] = useState<GarageItem | null>(null);

  const areas = ["All Areas", "Banani", "Gulshan", "Dhanmondi", "Uttara", "Mirpur", "Motijheel"];

  const fetchGarages = async () => {
    try {
      setLoading(true);
      const url = new URL("/api/garages", window.location.origin);
      if (query.trim()) url.searchParams.set("q", query.trim());
      if (selectedArea !== "All Areas") url.searchParams.set("area", selectedArea);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.garages) {
        setGarages(data.garages);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const url = new URL("/api/garages", window.location.origin);
        if (query.trim()) url.searchParams.set("q", query.trim());
        if (selectedArea !== "All Areas") url.searchParams.set("area", selectedArea);

        const res = await fetch(url.toString());
        const data = await res.json();
        if (!ignore && data.garages) {
          setGarages(data.garages);
        }
      } catch {
        // Handled
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [query, selectedArea]);

  return (
    <div className="space-y-6">
      {/* Search Header Bar in White Theme */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by parking name, street address, or location..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs outline-none focus:border-[#f39c12] focus:bg-white transition"
            />
          </div>
          <button
            onClick={fetchGarages}
            className="rounded-2xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-6 py-3 text-xs font-bold shadow-md shadow-[#f39c12]/20 transition"
          >
            Search Spots
          </button>
        </div>

        {/* Quick Area Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1">Popular Hubs:</span>
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedArea === area
                  ? "bg-[#f39c12] text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Available Parking Lots ({garages.length})
        </h2>
        <span className="text-xs text-slate-500">Live GPS & sensor telemetry enabled</span>
      </div>

      {/* Garages Grid in White Theme */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : garages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <span className="text-4xl">🚗</span>
          <h3 className="text-base font-bold text-slate-900 mt-3">No Parking Spaces Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for a different area or removing query filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {garages.map((garage) => {
            const is24_7 = garage.schedule?.is_24_7 ?? true;
            const availableSlots = garage.availability ?? 5;
            const totalSlots = garage.parking_capacity ?? 20;
            const isAvailable = availableSlots > 0;

            return (
              <div
                key={garage.garage_id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#f39c12]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100">
                    <Image
                      src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=600&auto=format&fit=crop"
                      alt={garage.parking_space_name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm ${
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {isAvailable ? "● Available" : "● Full"}
                      </span>
                      {is24_7 && (
                        <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold shadow-sm">
                          24/7
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {garage.parking_space_name}
                      </h3>
                      <div className="text-xs font-bold text-amber-500 whitespace-nowrap">
                        ★ {garage.summary?.average_rating || 4.9}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">📍 {garage.parking_lot_address}</p>

                    {/* 3-column stats */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Available</div>
                        <div className="text-sm font-bold text-emerald-600 mt-0.5">
                          {availableSlots}/{totalSlots}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Rating</div>
                        <div className="text-sm font-bold text-amber-500 mt-0.5">
                          ★ {garage.summary?.average_rating || 4.9}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Hourly</div>
                        <div className="text-sm font-bold text-[#d97706] mt-0.5">
                          ৳{garage.price_per_hour}/hr
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedGarageForBooking(garage)}
                    className="w-full text-center rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white py-2.5 text-xs font-bold shadow-md shadow-[#f39c12]/20 transition"
                  >
                    Reserve Parking Spot
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedGarageForBooking && (
        <BookingModal
          garage={selectedGarageForBooking}
          onClose={() => setSelectedGarageForBooking(null)}
          onSuccess={() => {
            setSelectedGarageForBooking(null);
            fetchGarages();
          }}
        />
      )}
    </div>
  );
}
