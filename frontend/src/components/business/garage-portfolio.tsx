"use client";

import { useEffect, useState } from "react";

export interface HostGarage {
  id: number;
  garage_id: string;
  parking_space_name: string;
  parking_lot_address: string;
  parking_type: string | null;
  parking_space_dimensions: string | null;
  parking_capacity: number;
  availability: number;
  price_per_hour: number;
  is_verified: boolean;
  schedule?: {
    is_24_7: boolean;
    opening_time: string | null;
    closing_time: string | null;
    operating_days: string[];
  };
  real_time_status?: {
    current_status: "available" | "busy" | "closed";
    is_manual_override: boolean;
    force_closed?: boolean;
    override_reason?: string | null;
  };
  summary?: {
    average_rating: number;
    total_ratings: number;
  };
}

interface GaragePortfolioProps {
  onSelectGarageForSchedule?: (garage: HostGarage) => void;
}

export function GaragePortfolio({ onSelectGarageForSchedule }: GaragePortfolioProps) {
  const [garages, setGarages] = useState<HostGarage[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Garage Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("Indoor");
  const [dimensions, setDimensions] = useState("Standard (Car & Bike)");
  const [capacity, setCapacity] = useState("10");
  const [price, setPrice] = useState("50");
  const [is24_7, setIs24_7] = useState(true);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("22:00");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGarages = async () => {
    try {
      const res = await fetch("/api/business/garages");
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
        const res = await fetch("/api/business/garages");
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
  }, []);

  const handleAddGarage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/business/garages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parkingSpaceName: name.trim(),
          parkingLotAddress: address.trim(),
          parkingType: type,
          parkingSpaceDimensions: dimensions,
          parkingCapacity: parseInt(capacity, 10),
          pricePerHour: parseFloat(price),
          is24_7,
          openingTime,
          closingTime,
          latitude: 23.8103,
          longitude: 90.4125,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register garage");
      }

      setShowAddModal(false);
      setName("");
      setAddress("");
      fetchGarages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error adding garage";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Garage & Parking Spaces Portfolio</h2>
          <p className="text-xs text-slate-500">
            Manage your registered parking lots, capacity limits, hourly rates, and live status.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-[#f39c12]/20"
        >
          + Add New Parking Space
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : garages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="text-base font-bold text-slate-900">No parking spaces listed yet</h3>
          <p className="mt-1 text-xs text-slate-500">
            Add your first residential or commercial parking lot to start receiving bookings.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-2 text-xs font-bold shadow-md shadow-[#f39c12]/20 transition"
          >
            + Add Parking Space Now
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {garages.map((garage) => {
            const isClosed = garage.real_time_status?.current_status === "closed" || garage.real_time_status?.force_closed;
            const is24_7 = garage.schedule?.is_24_7;

            return (
              <div
                key={garage.garage_id}
                className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-[#f39c12]/50 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          isClosed
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {isClosed ? "Closed (Override)" : "Active & Open"}
                      </span>
                      {is24_7 && (
                        <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold">
                          24/7
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-amber-500">
                      ★ {garage.summary?.average_rating || 5.0}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{garage.parking_space_name}</h3>
                  <p className="mt-1 text-xs text-slate-500">📍 {garage.parking_lot_address}</p>

                  {/* Stats Grid in White Theme */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Total Capacity</div>
                      <div className="font-bold text-slate-900 mt-0.5">{garage.parking_capacity} Slots</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Hourly Rate</div>
                      <div className="font-bold text-[#d97706] mt-0.5">৳{garage.price_per_hour.toFixed(2)}/hr</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Type</div>
                      <div className="font-medium text-slate-700 mt-0.5">{garage.parking_type}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Verification</div>
                      <div className="font-medium text-amber-600 mt-0.5">
                        {garage.is_verified ? "Verified ✓" : "Pending Review"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 flex gap-2">
                  {onSelectGarageForSchedule && (
                    <button
                      onClick={() => onSelectGarageForSchedule(garage)}
                      className="flex-1 rounded-xl bg-slate-100 hover:bg-[#f39c12] hover:text-white py-2 text-xs font-bold text-slate-700 transition border border-slate-200"
                    >
                      ⚡ Timing & Schedule Controls
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Garage Modal in White Theme */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">List New Parking Facility</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleAddGarage} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Facility / Garage Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Banani Safe Covered Parking"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Detailed Street Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Road 11, Block D, Banani, Dhaka"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Parking Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  >
                    <option value="Indoor">Indoor / Covered</option>
                    <option value="Basement">Basement Garage</option>
                    <option value="Outdoor">Outdoor / Open Lot</option>
                    <option value="Rooftop">Rooftop Facility</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="Standard (Car & SUV)"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Capacity (Slots) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price Per Hour (৳) *</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal247"
                    checked={is24_7}
                    onChange={(e) => setIs24_7(e.target.checked)}
                    className="w-4 h-4 accent-[#f39c12]"
                  />
                  <label htmlFor="modal247" className="text-xs font-bold text-slate-900">
                    Open 24 Hours / 7 Days a Week
                  </label>
                </div>

                {!is24_7 && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-500 text-[11px] mb-1">Opening Time</label>
                      <input
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[11px] mb-1">Closing Time</label>
                      <input
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-2.5 font-bold text-white shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50"
                >
                  {submitting ? "Listing..." : "Register Facility"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
