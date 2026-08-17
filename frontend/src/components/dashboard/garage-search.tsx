"use client";

import { useEffect, useState } from "react";

import { BookingModal, GarageItem } from "./booking-modal";

interface GarageSearchProps {
  userPoints: number;
  onBookingSuccess: (bookingId: number) => void;
}

export function GarageSearch({ userPoints, onBookingSuccess }: GarageSearchProps) {
  const [garages, setGarages] = useState<GarageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

  const [selectedGarageForBooking, setSelectedGarageForBooking] = useState<GarageItem | null>(null);

  const fetchGarages = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("q", searchTerm);
      if (selectedType !== "all") params.set("type", selectedType);
      if (maxPrice) params.set("maxPrice", maxPrice.toString());

      const res = await fetch(`/api/garages?${params.toString()}`);
      const data = await res.json();
      if (data.garages) {
        setGarages(data.garages);
      }
    } catch {
      // Fallback handled by API
    } finally {
      setLoading(false);
    }
  };

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
    <div>
      {/* Search & Filter Controls */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl mb-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search area (e.g. Banani, Gulshan, Dhanmondi, Uttara)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
          >
            <option value="all">All Parking Types</option>
            <option value="indoor">Indoor Garage</option>
            <option value="covered">Covered Space</option>
            <option value="outdoor">Outdoor Lot</option>
          </select>

          {/* Max Price Filter */}
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
            className="rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
          >
            <option value="">Any Hourly Rate</option>
            <option value="40">Under ৳40/hr</option>
            <option value="60">Under ৳60/hr</option>
            <option value="80">Under ৳80/hr</option>
          </select>
        </div>
      </div>

      {/* Garages List */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          ))}
        </div>
      ) : garages.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
          <div className="text-3xl mb-2">🅿️</div>
          <h3 className="text-base font-bold text-white">No parking spaces matched your filters</h3>
          <p className="mt-1 text-xs text-neutral-400">Try changing your search term or price constraints.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setMaxPrice("");
            }}
            className="mt-4 rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {garages.map((garage) => {
            const availRatio = garage.parking_capacity
              ? (garage.availability / garage.parking_capacity) * 100
              : 50;

            const isAvailable = garage.availability > 0;

            return (
              <div
                key={garage.garage_id}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-5 backdrop-blur-xl transition hover:border-emerald-500/50 hover:bg-neutral-900 shadow-xl"
              >
                <div>
                  {/* Top Bar: Verification & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      {garage.is_verified && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                          Verified ✓
                        </span>
                      )}
                      {garage.is_24_7 && (
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                          24/7 Access
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                      <span>★</span>
                      <span>{garage.average_rating}</span>
                      <span className="text-[10px] text-neutral-500">({garage.total_ratings})</span>
                    </div>
                  </div>

                  {/* Name & Address */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                    {garage.parking_space_name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 flex items-start gap-1">
                    <span>📍</span>
                    <span>{garage.parking_lot_address}</span>
                  </p>

                  <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                    {/* Capacity Meter */}
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-neutral-400">Live Slots Available:</span>
                      <span className={`font-bold ${isAvailable ? "text-emerald-400" : "text-red-400"}`}>
                        {garage.availability} / {garage.parking_capacity}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          availRatio > 40
                            ? "bg-emerald-500"
                            : availRatio > 10
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${availRatio}%` }}
                      />
                    </div>

                    <div className="mt-2.5 flex justify-between text-[11px] text-neutral-400 border-t border-neutral-850 pt-2">
                      <span>Type: <strong className="text-neutral-200">{garage.parking_type}</strong></span>
                      <span>Dim: <strong className="text-neutral-200">{garage.parking_space_dimensions}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Price & Book Button */}
                <div className="mt-5 flex items-center justify-between border-t border-neutral-800/80 pt-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500">Rate</div>
                    <div className="text-lg font-black text-white">
                      ৳{garage.price_per_hour}
                      <span className="text-xs font-normal text-neutral-400">/hr</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedGarageForBooking(garage)}
                    disabled={!isAvailable}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                      isAvailable
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 shadow-md shadow-emerald-500/20 hover:opacity-95"
                        : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    }`}
                  >
                    {isAvailable ? "Book Spot 🚗" : "Full"}
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
          onBookingSuccess={(bookingId) => {
            setSelectedGarageForBooking(null);
            onBookingSuccess(bookingId);
            fetchGarages();
          }}
        />
      )}
    </div>
  );
}
