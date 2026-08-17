"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  id: number;
  license_plate: string;
  vehicle_type: string;
  make: string | null;
  model: string | null;
  color: string | null;
}

export function VehiclesManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form State matching add_vehicle.php
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      if (data.vehicles) {
        setVehicles(data.vehicles);
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
        const res = await fetch("/api/vehicles");
        const data = await res.json();
        if (!ignore && data.vehicles) {
          setVehicles(data.vehicles);
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

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setLicensePlate("");
    setVehicleType("car");
    setMake("");
    setModel("");
    setColor("");
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setLicensePlate(vehicle.license_plate);
    setVehicleType(vehicle.vehicle_type || "car");
    setMake(vehicle.make || "");
    setModel(vehicle.model || "");
    setColor(vehicle.color || "");
    setError(null);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (plate: string) => {
    if (!confirm(`Are you sure you want to delete vehicle with license plate ${plate}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/vehicles?plate=${encodeURIComponent(plate)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete vehicle");
      }

      setSuccessMessage("Vehicle successfully deleted!");
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchVehicles();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlate,
          vehicleType,
          make,
          model,
          color,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save vehicle");
      }

      setIsModalOpen(false);
      setSuccessMessage(editingVehicle ? "Vehicle updated successfully!" : "New vehicle registered successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchVehicles();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header in White Theme */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">My Vehicles</h2>
          <p className="text-slate-500 text-xs">Manage your vehicles for parking reservations</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-[#f39c12]/20 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Vehicle
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Vehicles Grid in White Theme */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100 border border-slate-200" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-slate-300 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <h3 className="text-slate-900 text-lg font-bold mb-2">No Vehicles Found</h3>
          <p className="text-slate-500 text-xs mb-6">You haven&apos;t added any vehicles to your account yet.</p>
          <button
            onClick={handleOpenAddModal}
            className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-2.5 text-xs font-bold transition shadow-md shadow-[#f39c12]/20"
          >
            + Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.license_plate}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#f39c12]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-[#f39c12] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-[#d97706]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] uppercase font-bold text-slate-700 border border-slate-200">
                    {vehicle.vehicle_type || "Car"}
                  </span>
                </div>

                <h3 className="text-slate-900 text-lg font-bold mb-1">
                  {vehicle.make || "Vehicle"} {vehicle.model || ""}
                </h3>
                <p className="text-slate-500 text-xs mb-4 capitalize">
                  {vehicle.vehicle_type || "Car"} • {vehicle.color || "Standard Color"}
                </p>

                {/* License Plate Banner in White Theme */}
                <div className="bg-slate-50 rounded-xl p-3 text-center mb-5 border border-slate-200">
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">License Plate</p>
                  <p className="text-slate-900 text-base font-bold tracking-wider font-mono">
                    {vehicle.license_plate}
                  </p>
                </div>
              </div>

              {/* Action Buttons in White Theme */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEditModal(vehicle)}
                  className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white text-center text-xs font-bold py-2.5 transition shadow-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.license_plate)}
                  className="flex-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-center text-xs font-bold py-2.5 transition border border-slate-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal in White Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingVehicle ? "Edit Vehicle Details" : "Add New Vehicle"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleSaveVehicle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  License Plate Number *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingVehicle)}
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="e.g. DHA-D-12-4545"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12] disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Make (Brand)</label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Toyota"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Corolla / Premio"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
                  >
                    <option value="car">Car / Sedan</option>
                    <option value="suv">SUV / Jeep</option>
                    <option value="microbus">Microbus / Van</option>
                    <option value="bike">Motorcycle / Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Pearl White"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-2.5 font-bold text-white shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
