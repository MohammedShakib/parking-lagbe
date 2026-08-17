"use client";

import { useEffect, useState } from "react";

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
}

interface Vehicle {
  license_plate: string;
  vehicle_type: string;
  make: string | null;
  model: string | null;
  color: string | null;
}

interface BookingModalProps {
  garage: GarageItem | null;
  onClose: () => void;
  onBookingSuccess: (bookingId: number) => void;
  userPoints: number;
}

export function BookingModal({
  garage,
  onClose,
  onBookingSuccess,
  userPoints,
}: BookingModalProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedPlate, setSelectedPlate] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newVehicleType, setNewVehicleType] = useState("Car");
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState(todayStr);

  const nowHours = new Date().getHours().toString().padStart(2, "0");
  const nowMinutes = "00";
  const [bookingTime, setBookingTime] = useState(`${nowHours}:${nowMinutes}`);

  const [duration, setDuration] = useState(2);
  const [usePoints, setUsePoints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/vehicles");
        const data = await res.json();
        if (!ignore && data.vehicles && data.vehicles.length > 0) {
          setVehicles(data.vehicles);
          setSelectedPlate(data.vehicles[0].license_plate);
        } else if (!ignore) {
          setShowAddVehicle(true);
        }
      } catch {
        // Fallback
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAddQuickVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlate: newPlate.trim().toUpperCase(),
          vehicleType: newVehicleType,
        }),
      });
      const data = await res.json();
      if (res.ok && data.vehicle) {
        setVehicles((prev) => [...prev, data.vehicle]);
        setSelectedPlate(data.vehicle.license_plate);
        setShowAddVehicle(false);
        setNewPlate("");
      } else {
        setError(data.error || "Failed to add vehicle");
      }
    } catch {
      setError("Failed to add vehicle");
    }
  };

  if (!garage) return null;

  const rawTotal = garage.price_per_hour * duration;
  const maxPointsApplicable = Math.min(userPoints, rawTotal);
  const pointsDiscount = usePoints ? maxPointsApplicable : 0;
  const finalPayable = Math.max(0, rawTotal - pointsDiscount);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlate && !newPlate) {
      setError("Please select or add a vehicle license plate.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const plateToUse = selectedPlate || newPlate.trim().toUpperCase();

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garageId: garage.garage_id,
          licensePlate: plateToUse,
          bookingDate,
          bookingTime: `${bookingTime}:00`,
          duration,
          paidWithPoints: usePoints,
          pointsUsed: pointsDiscount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not reserve spot. Please try another time.");
      }

      onBookingSuccess(data.bookingId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking error";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          ✕
        </button>

        <div className="mb-4">
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
            Instant Spot Reservation
          </span>
          <h2 className="mt-2 text-xl font-bold text-white">{garage.parking_space_name}</h2>
          <p className="text-xs text-neutral-400">{garage.parking_lot_address}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitBooking} className="space-y-4">
          {/* Vehicle Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-400">Select Vehicle</label>
              <button
                type="button"
                onClick={() => setShowAddVehicle(!showAddVehicle)}
                className="text-xs text-emerald-400 hover:underline"
              >
                {showAddVehicle ? "Select existing" : "+ Add new vehicle"}
              </button>
            </div>

            {showAddVehicle ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Plate (e.g. DHA-GA-11-2233)"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white uppercase outline-none focus:border-emerald-500"
                  />
                  <select
                    value={newVehicleType}
                    onChange={(e) => setNewVehicleType(e.target.value)}
                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Car">Car (Sedan/SUV)</option>
                    <option value="Motorcycle">Motorcycle / Bike</option>
                    <option value="Microbus">Microbus</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuickVehicle}
                  className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-neutral-950 hover:bg-emerald-400"
                >
                  Save & Use Vehicle
                </button>
              </div>
            ) : (
              <select
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              >
                {vehicles.map((v) => (
                  <option key={v.license_plate} value={v.license_plate}>
                    {v.license_plate} - {v.make || ""} {v.model || v.vehicle_type}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Reservation Date</label>
              <input
                type="date"
                min={todayStr}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Arrival Time</label>
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-400">Duration (Hours)</label>
              <span className="text-xs font-bold text-emerald-400">{duration} Hour{duration > 1 ? "s" : ""}</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>1 hr</span>
              <span>4 hrs</span>
              <span>8 hrs</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Points Discount Option */}
          {userPoints > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-amber-300">Redeem Points</div>
                <div className="text-[11px] text-neutral-400">
                  Available: {userPoints} pts (Discount: ৳{maxPointsApplicable})
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => setUsePoints(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          )}

          {/* Price Calculation Summary */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1.5 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Rate:</span>
              <span>৳{garage.price_per_hour}/hr × {duration} hrs</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal:</span>
              <span>৳{rawTotal}</span>
            </div>
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Points Discount:</span>
                <span>-৳{pointsDiscount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-white border-t border-neutral-800 pt-2 text-sm">
              <span>Total Payable:</span>
              <span className="text-emerald-400">৳{finalPayable}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-semibold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Confirming Spot..." : "Reserve Parking Spot 🚗"}
          </button>
        </form>
      </div>
    </div>
  );
}
