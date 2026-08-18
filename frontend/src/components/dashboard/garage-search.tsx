"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";

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
    <div className="space-y-8">
      {/* Search & Filters */}
      <div className="space-y-5 pt-2">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Parking spaces near you</h2>
          <p className="text-sm text-slate-500 mt-1">{garages.length} locations available</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by area, parking name or address"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#e5eaf0] text-slate-900 placeholder:text-slate-400 text-sm outline-none focus:border-[#149fe8] focus:ring-1 focus:ring-[#149fe8] transition"
            />
          </div>
          <button
            onClick={fetchGarages}
            className="rounded-xl bg-[#0b1f33] hover:bg-[#162d47] text-white px-6 py-3 text-sm font-semibold transition"
          >
            Search
          </button>
        </div>

        {/* Quick Area Filters */}
        <div className="flex flex-nowrap overflow-x-auto items-center gap-2 pb-2 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 mr-1 whitespace-nowrap">Popular Hubs:</span>
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap border ${
                selectedArea === area
                  ? "bg-[#0b1f33] text-white border-[#0b1f33]"
                  : "bg-white text-slate-600 border-[#e5eaf0] hover:bg-[#f7f9fb]"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Garages Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-100 border border-[#e5eaf0] animate-pulse" />
          ))}
        </div>
      ) : garages.length === 0 ? (
        <div className="py-16 text-center">
          <h3 className="text-lg font-bold text-[#0f172a]">No parking spaces found</h3>
          <p className="text-sm text-slate-500 mt-2 mb-4">
            Try searching for a different area or removing query filters.
          </p>
          <button
             onClick={() => { setQuery(""); setSelectedArea("All Areas"); }}
             className="px-4 py-2 rounded-lg bg-white border border-[#e5eaf0] text-sm font-semibold text-slate-700 hover:bg-[#f7f9fb] transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {garages.map((garage) => {
            const is24_7 = garage.schedule?.is_24_7 ?? true;
            const availableSlots = garage.availability ?? 5;
            const isAvailable = availableSlots > 0;

            return (
              <div
                key={garage.garage_id}
                className="bg-white rounded-2xl border border-[#e5eaf0] overflow-hidden hover:border-[#149fe8] hover:shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:-translate-y-[2px] transition-all duration-200 flex flex-col"
              >
                <div className="relative aspect-[16/9] w-full bg-[#f7f9fb]">
                  <Image
                    src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=600&auto=format&fit=crop"
                    alt={garage.parking_space_name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {isAvailable && (
                      <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 text-[11px] font-semibold">
                        Available
                      </span>
                    )}
                    {is24_7 && (
                      <span className="rounded-md bg-white/90 text-slate-700 border border-slate-200/80 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
                        24/7
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0f172a] leading-snug mb-1">
                      {garage.parking_space_name}
                    </h3>
                    <div className="flex items-start gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <p className="text-sm line-clamp-1">{garage.parking_lot_address}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#e5eaf0]/60">
                    <div className="text-sm text-slate-600 font-medium">
                      <span className={isAvailable ? "text-emerald-600 font-semibold" : "text-slate-500"}>{availableSlots} spaces</span>
                      <span className="mx-1.5 text-slate-300">•</span>
                      <span className="text-[#0f172a] font-bold">৳{garage.price_per_hour}</span><span className="text-xs">/hr</span>
                      <span className="mx-1.5 text-slate-300">•</span>
                      <span className="text-amber-500 font-semibold text-xs">★ {garage.summary?.average_rating || 4.9}</span>
                    </div>

                    <button
                      onClick={() => setSelectedGarageForBooking(garage)}
                      className="shrink-0 text-[#149fe8] hover:text-[#0b1f33] text-sm font-semibold transition flex items-center gap-1 group"
                    >
                      View
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
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
