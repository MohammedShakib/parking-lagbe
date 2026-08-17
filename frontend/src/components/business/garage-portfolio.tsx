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
          <h2 className="text-xl font-bold text-white">Garage & Parking Spaces Portfolio</h2>
          <p className="text-xs text-neutral-400">
            Manage your registered parking lots, capacity limits, hourly rates, and live status.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-lg shadow-teal-500/20 hover:opacity-95"
        >
          + Add New Parking Space
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          ))}
        </div>
      ) : garages.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="text-base font-bold text-white">No parking spaces listed yet</h3>
          <p className="mt-1 text-xs text-neutral-400">
            List your residential or commercial parking slots to start receiving bookings and earnings.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 rounded-xl bg-teal-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-teal-300"
          >
            Register Your First Space
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
                className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-xl transition hover:border-teal-500/40 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          isClosed
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {isClosed ? "Closed (Override)" : "Active & Open"}
                      </span>
                      {is24_7 && (
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                          24/7
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-amber-400">
                      ★ {garage.summary?.average_rating || 5.0}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">{garage.parking_space_name}</h3>
                  <p className="mt-1 text-xs text-neutral-400">📍 {garage.parking_lot_address}</p>

                  {/* Stats Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs">
                    <div>
                      <div className="text-[10px] uppercase text-neutral-500">Total Capacity</div>
                      <div className="font-bold text-white mt-0.5">{garage.parking_capacity} Slots</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-neutral-500">Hourly Rate</div>
                      <div className="font-bold text-teal-400 mt-0.5">৳{garage.price_per_hour}/hr</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-neutral-500">Type</div>
                      <div className="font-medium text-neutral-300 mt-0.5">{garage.parking_type}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-neutral-500">Availability</div>
                      <div className="font-bold text-emerald-400 mt-0.5">{garage.availability} Slots Open</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-neutral-800 pt-3">
                  <span className="font-mono text-[11px] text-neutral-500">ID: {garage.garage_id}</span>
                  {onSelectGarageForSchedule && (
                    <button
                      onClick={() => onSelectGarageForSchedule(garage)}
                      className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 transition"
                    >
                      Schedule & Controls ⚡
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Garage Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Add New Parking Space</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Register a new parking location to start receiving customer bookings.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleAddGarage} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Parking Space / Garage Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Green Valley Parking Zone"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Address & Area</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Road 11, Banani, Dhaka"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Parking Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                  >
                    <option value="Indoor">Indoor Garage</option>
                    <option value="Covered">Covered Lot</option>
                    <option value="Outdoor">Outdoor Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. Standard (Sedan/SUV)"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Total Capacity (Slots)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Price Per Hour (৳)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Schedule 24/7 */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">24/7 Operating Hours</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={is24_7}
                      onChange={(e) => setIs24_7(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                {!is24_7 && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-1">Opening Time</label>
                      <input
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400 mb-1">Closing Time</label>
                      <input
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-teal-500/20 hover:opacity-95 disabled:opacity-50 mt-4"
              >
                {submitting ? "Registering Space..." : "Register Parking Space 🅿️"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
