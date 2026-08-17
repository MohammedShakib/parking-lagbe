"use client";

import { useEffect, useState } from "react";

import { BookingModal } from "./booking-modal";

export interface GarageItem {
  garage_id: string;
  parking_space_name: string;
  parking_lot_address: string;
  parking_type: string;
  parking_space_dimensions: string;
  parking_capacity: number;
  availability: number;
  price_per_hour: number;
  is_verified: boolean;
  latitude: number;
  longitude: number;
  average_rating: number;
  total_ratings: number;
  is_24_7: boolean;
  opening_time?: string | null;
  closing_time?: string | null;
}

interface GarageSearchProps {
  userPoints: number;
  onBookingSuccess?: () => void;
}

export function GarageSearch({ userPoints, onBookingSuccess }: GarageSearchProps) {
  const [garages, setGarages] = useState<GarageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const [selectedGarageForBooking, setSelectedGarageForBooking] = useState<GarageItem | null>(null);

  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set("q", searchTerm);
        if (selectedType !== "all") params.set("type", selectedType);
        if (maxPrice) params.set("maxPrice", maxPrice.toString());

        const res = await fetch(`/api/garages?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.garages) {
          setGarages(data.garages);
        }
      } catch {
        // Handled
      } finally {
        if (!ignore) setLoading(false);
      }
    }, 250);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedType, maxPrice]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Panel matching home.php */}
      <div className="rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 p-5 shadow-xl space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by area or street (e.g. Banani, Dhanmondi, Gulshan, Uttara, Mirpur)..."
              className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-xs text-white placeholder-white/50 outline-none focus:border-[#f39c12]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-xs text-white outline-none focus:border-[#f39c12]"
            >
              <option value="all">All Parking Types</option>
              <option value="Indoor">Indoor Garage</option>
              <option value="Covered">Covered Space</option>
              <option value="Outdoor">Outdoor Lot</option>
            </select>

            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
              placeholder="Max ৳/hr"
              className="w-24 rounded-xl border border-white/20 bg-black/50 px-3 py-3 text-xs text-white placeholder-white/50 outline-none focus:border-[#f39c12]"
            />

            {(searchTerm || selectedType !== "all" || maxPrice !== "") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setMaxPrice("");
                }}
                className="rounded-xl border border-white/20 bg-black/40 px-3 py-3 text-xs text-white/80 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Quick Area Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-white/60 font-medium">Quick Areas:</span>
          {["Banani", "Dhanmondi", "Gulshan", "Uttara", "Mirpur", "Motijheel"].map((area) => (
            <button
              key={area}
              onClick={() => setSearchTerm(area)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                searchTerm.toLowerCase() === area.toLowerCase()
                  ? "bg-[#f39c12] text-white shadow-sm"
                  : "border border-white/10 bg-black/40 text-white/80 hover:border-white/30 hover:text-white"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Garages List matching home.php card design */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-black/40 border border-white/10" />
          ))}
        </div>
      ) : garages.length === 0 ? (
        <div className="rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 p-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-base font-bold text-white">No parking spaces matched your criteria</h3>
          <p className="mt-1 text-xs text-white/70">
            Try adjusting your search area or removing filters to see all available spots in Dhaka.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {garages.map((garage) => {
            const isFull = garage.availability <= 0;
            const isLimited = garage.availability < garage.parking_capacity / 2;

            return (
              <div
                key={garage.garage_id}
                className="flex flex-col justify-between rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl hover:border-[#f39c12]/40"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-40 w-full bg-gradient-to-tr from-neutral-900 to-neutral-800 flex items-center justify-center border-b border-white/10 overflow-hidden">
                    <span className="text-5xl opacity-40">🅿️</span>
                    <span className="absolute top-3 left-3 rounded-full bg-[#f39c12] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                      {garage.is_24_7 ? "24/7 Access" : "Open Today"}
                    </span>
                    <span
                      className={`absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow ${
                        isFull ? "bg-red-500" : isLimited ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                    >
                      {isFull ? "Full" : isLimited ? "Limited" : "Available"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-white leading-snug">
                        {garage.parking_space_name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 flex-shrink-0">
                        <span>★</span>
                        <span>{garage.average_rating || 5.0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-white/80 mb-4">
                      <span className="text-[#f39c12]">📍</span>
                      <span className="truncate">{garage.parking_lot_address}</span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/40 border border-white/10 p-3 text-xs">
                      <div>
                        <div className="text-[10px] uppercase text-white/60">Rate</div>
                        <div className="font-bold text-[#f39c12] text-sm mt-0.5">
                          ৳{garage.price_per_hour.toFixed(2)}/hr
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-white/60">Capacity</div>
                        <div className="font-bold text-emerald-400 text-sm mt-0.5">
                          {garage.availability} / {garage.parking_capacity} Open
                        </div>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-white/10 text-[11px] text-white/70">
                        Type: <strong className="text-white">{garage.parking_type || "Covered"}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    disabled={isFull}
                    onClick={() => setSelectedGarageForBooking(garage)}
                    className="w-full rounded-xl bg-[#f39c12] py-2.5 text-xs font-bold text-white hover:bg-[#e67e22] shadow-lg shadow-[#f39c12]/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFull ? "Fully Booked" : "Book Spot Now 🎫"}
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
          userPoints={userPoints}
          onClose={() => setSelectedGarageForBooking(null)}
          onBookingSuccess={() => {
            setSelectedGarageForBooking(null);
            if (onBookingSuccess) onBookingSuccess();
          }}
        />
      )}
    </div>
  );
}
