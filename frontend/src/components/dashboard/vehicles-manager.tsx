"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  license_plate: string;
  vehicle_type: string;
  make: string | null;
  model: string | null;
  color: string | null;
}

export function VehiclesManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [plate, setPlate] = useState("");
  const [type, setType] = useState("Car");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      if (data.vehicles) {
        setVehicles(data.vehicles);
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/vehicles");
        const data = await res.json();
        if (!ignore && data.vehicles) {
          setVehicles(data.vehicles);
        }
      } catch {
        // Handle error
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlate: plate.trim().toUpperCase(),
          vehicleType: type,
          make: make.trim() || null,
          model: model.trim() || null,
          color: color.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add vehicle");
      }

      setShowAddModal(false);
      setPlate("");
      setMake("");
      setModel("");
      setColor("");
      fetchVehicles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error adding vehicle";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (licensePlate: string) => {
    if (!confirm(`Are you sure you want to remove vehicle ${licensePlate}?`)) return;

    try {
      const res = await fetch(`/api/vehicles?plate=${encodeURIComponent(licensePlate)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.license_plate !== licensePlate));
      }
    } catch {
      // Handle error
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType.toLowerCase()) {
      case "motorcycle":
      case "bike":
        return "🏍️";
      case "microbus":
        return "🚐";
      default:
        return "🚗";
    }
  };

  return (
    <div>
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Registered Vehicles</h2>
          <p className="text-xs text-neutral-400">
            Add your car or motorcycle license plates for quick 1-click spot reservations.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
        >
          + Add New Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
          <div className="text-4xl mb-3">🚗</div>
          <h3 className="text-base font-bold text-white">No vehicles added yet</h3>
          <p className="mt-1 text-xs text-neutral-400">
            Register your vehicle license plates to reserve parking spaces seamlessly.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-400"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <div
              key={v.license_plate}
              className="relative flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-xl transition hover:border-neutral-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 border border-neutral-800 text-2xl">
                    {getVehicleIcon(v.vehicle_type)}
                  </div>
                  <div>
                    <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold text-neutral-300">
                      {v.vehicle_type}
                    </span>
                    <h3 className="text-base font-black text-white tracking-wider mt-1">
                      {v.license_plate}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteVehicle(v.license_plate)}
                  className="text-neutral-500 hover:text-red-400 text-xs p-1"
                  title="Remove vehicle"
                >
                  🗑️
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-800/80 pt-3 text-xs text-neutral-400">
                <span>
                  {v.make || "Standard"} {v.model || ""}
                </span>
                {v.color && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-neutral-700"
                      style={{ backgroundColor: v.color.toLowerCase() }}
                    />
                    <span className="capitalize">{v.color}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Add Vehicle</h3>
            <p className="text-xs text-neutral-400 mb-4">Enter your vehicle details.</p>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  License Plate Number
                </label>
                <input
                  type="text"
                  required
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="e.g. DHAKA-METRO-GA-11-2233"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white uppercase outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Vehicle Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Car">Car (Sedan/SUV)</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Microbus">Microbus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Silver / White"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Make (Brand)</label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Toyota"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Premio / Corolla"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:opacity-95 disabled:opacity-50 mt-4"
              >
                {submitting ? "Saving..." : "Save Vehicle"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
