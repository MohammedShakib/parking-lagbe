"use client";

import { useEffect, useState } from "react";

import { GarageItem } from "./garage-search";

interface Vehicle {
  id: number;
  license_plate: string;
  vehicle_type: string;
  make: string | null;
  model: string | null;
}

interface BookingModalProps {
  garage: GarageItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ garage, onClose, onSuccess }: BookingModalProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<string>("");
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [bookingTime, setBookingTime] = useState("10:00");
  const [duration, setDuration] = useState(2);
  const [usePoints, setUsePoints] = useState(false);
  const [availablePoints, setAvailablePoints] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [vRes, pRes] = await Promise.all([
          fetch("/api/vehicles"),
          fetch("/api/points"),
        ]);
        const vData = await vRes.json();
        const pData = await pRes.json();

        if (vData.vehicles && vData.vehicles.length > 0) {
          setVehicles(vData.vehicles);
          setSelectedPlate(vData.vehicles[0].license_plate);
        }
        if (pData.points) {
          setAvailablePoints(pData.points);
        }
      } catch {
        // Handled
      }
    }
    loadData();
  }, []);

  const rawTotal = duration * garage.price_per_hour;
  // 150 points gives 1 hour free
  const pointsDiscount = usePoints && availablePoints >= 150 ? garage.price_per_hour : 0;
  const finalTotal = Math.max(0, rawTotal - pointsDiscount);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlate) {
      setError("Please select or add a vehicle first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garageId: garage.garage_id,
          licensePlate: selectedPlate,
          bookingDate,
          bookingTime,
          duration,
          usePoints,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reserve parking");
      }

      alert("🎉 Booking confirmed successfully!");
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Reserve Parking Spot</h3>
            <p className="text-xs text-slate-500">{garage.parking_space_name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-4 text-xs">
          {/* Select Vehicle */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Select Vehicle *</label>
            {vehicles.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                No vehicles registered. Please add a vehicle in the <strong>My Vehicles</strong> tab.
              </div>
            ) : (
              <select
                value={selectedPlate}
                onChange={(e) => setSelectedPlate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
              >
                {vehicles.map((v) => (
                  <option key={v.license_plate} value={v.license_plate}>
                    {v.make} {v.model} ({v.license_plate}) - {v.vehicle_type}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Arrival Date</label>
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Arrival Time</label>
              <input
                type="time"
                required
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none focus:border-[#f39c12]"
              />
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-slate-700 font-bold">Parking Duration</label>
              <span className="text-xs font-black text-[#d97706]">{duration} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full accent-[#f39c12] cursor-pointer"
            />
          </div>

          {/* Loyalty Points Discount Option */}
          {availablePoints >= 150 && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <input
                type="checkbox"
                id="pointsDiscount"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
                className="w-4 h-4 accent-[#f39c12]"
              />
              <label htmlFor="pointsDiscount" className="text-xs text-amber-900 cursor-pointer">
                Redeem <strong>150 Points</strong> for 1 Hour Free Parking (Balance: {availablePoints} PTS)
              </label>
            </div>
          )}

          {/* Total Calculation Banner in White Theme */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Rate per hour:</span>
              <span>৳{garage.price_per_hour.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Duration:</span>
              <span>{duration} hour(s)</span>
            </div>
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Points Discount:</span>
                <span>-৳{pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
              <span className="font-bold text-slate-900">Total Payable:</span>
              <span className="text-lg font-black text-[#d97706]">৳{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || vehicles.length === 0}
              className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-3 font-bold text-white shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50"
            >
              {loading ? "Confirming..." : "Confirm Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
