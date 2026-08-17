"use client";

import { useEffect, useState } from "react";

interface AdminGarage {
  id: number;
  garage_id: string;
  username: string;
  parking_space_name: string;
  parking_lot_address: string;
  parking_type: string | null;
  parking_capacity: number;
  availability: number;
  price_per_hour: number;
  is_verified: boolean;
  summary?: {
    average_rating: number;
    total_ratings: number;
  };
}

export function AdminGarages() {
  const [garages, setGarages] = useState<AdminGarage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchGarages = async () => {
    try {
      const res = await fetch("/api/admin/garages");
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
        const res = await fetch("/api/admin/garages");
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

  const handleToggleVerification = async (garageId: string, current: boolean) => {
    setUpdatingId(garageId);
    try {
      const res = await fetch("/api/admin/garages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garageId, isVerified: !current }),
      });
      if (res.ok) {
        fetchGarages();
      }
    } catch {
      // Handled
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Garage Inventory & Safety Verification</h2>
        <p className="text-xs text-neutral-400">
          Verify registered parking spots to make them officially discoverable on the driver search map.
        </p>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
      ) : garages.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-xs text-neutral-500">
          No garages registered on the platform yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {garages.map((g) => (
            <div
              key={g.garage_id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-xl transition hover:border-neutral-700 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      g.is_verified
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {g.is_verified ? "Verified Space ✓" : "Pending Verification"}
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    ★ {g.summary?.average_rating || 5.0}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{g.parking_space_name}</h3>
                <p className="mt-1 text-xs text-neutral-400">📍 {g.parking_lot_address}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs">
                  <div>
                    <div className="text-[10px] uppercase text-neutral-500">Host</div>
                    <div className="font-bold text-white mt-0.5">@{g.username}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-neutral-500">Rate</div>
                    <div className="font-bold text-teal-400 mt-0.5">৳{g.price_per_hour}/hr</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-neutral-500">Capacity</div>
                    <div className="font-medium text-neutral-300 mt-0.5">{g.parking_capacity} Slots</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-neutral-500">Type</div>
                    <div className="font-medium text-neutral-300 mt-0.5">{g.parking_type}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-neutral-800 pt-3">
                <span className="font-mono text-[11px] text-neutral-500">{g.garage_id}</span>
                <button
                  disabled={updatingId === g.garage_id}
                  onClick={() => handleToggleVerification(g.garage_id, g.is_verified)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    g.is_verified
                      ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
                  }`}
                >
                  {updatingId === g.garage_id ? "..." : g.is_verified ? "Revoke Verification" : "Approve Garage ✓"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
