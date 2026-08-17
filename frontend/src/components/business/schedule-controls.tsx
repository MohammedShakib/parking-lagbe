"use client";

import { useEffect, useState } from "react";

import { HostGarage } from "./garage-portfolio";

export function ScheduleControls() {
  const [garages, setGarages] = useState<HostGarage[]>([]);
  const [selectedGarageId, setSelectedGarageId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Form State
  const [is24_7, setIs24_7] = useState(true);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [operatingDays, setOperatingDays] = useState<string[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]);

  const [currentStatus, setCurrentStatus] = useState<"available" | "busy" | "closed">("available");
  const [forceClosed, setForceClosed] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const populateForm = (garage: HostGarage) => {
    if (garage.schedule) {
      setIs24_7(garage.schedule.is_24_7);
      if (garage.schedule.opening_time) setOpeningTime(garage.schedule.opening_time.substring(0, 5));
      if (garage.schedule.closing_time) setClosingTime(garage.schedule.closing_time.substring(0, 5));
      if (garage.schedule.operating_days) setOperatingDays(garage.schedule.operating_days);
    }
    if (garage.real_time_status) {
      setCurrentStatus(garage.real_time_status.current_status || "available");
      setForceClosed(!!garage.real_time_status.force_closed);
      setOverrideReason(garage.real_time_status.override_reason || "");
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/business/garages");
        const data = await res.json();
        if (!ignore && data.garages && data.garages.length > 0) {
          setGarages(data.garages);
          setSelectedGarageId(data.garages[0].garage_id);
          populateForm(data.garages[0]);
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

  const handleGarageChange = (garageId: string) => {
    setSelectedGarageId(garageId);
    const found = garages.find((g) => g.garage_id === garageId);
    if (found) populateForm(found);
  };

  const toggleDay = (day: string) => {
    if (operatingDays.includes(day)) {
      setOperatingDays(operatingDays.filter((d) => d !== day));
    } else {
      setOperatingDays([...operatingDays, day]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGarageId) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    const selectedGarage = garages.find((g) => g.garage_id === selectedGarageId);

    try {
      const res = await fetch(`/api/business/garages/${selectedGarageId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parkingSpaceName: selectedGarage?.parking_space_name,
          parkingCapacity: selectedGarage?.parking_capacity,
          pricePerHour: selectedGarage?.price_per_hour,
          is24_7,
          openingTime,
          closingTime,
          operatingDays,
          currentStatus: forceClosed ? "closed" : currentStatus,
          isManualOverride: forceClosed || currentStatus !== "available",
          overrideReason: overrideReason || (forceClosed ? "Manual force closed by host" : null),
          forceClosed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update schedule");
      }

      setMessage("Schedule and live status updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update error";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const daysList = [
    { id: "monday", label: "Mon" },
    { id: "tuesday", label: "Tue" },
    { id: "wednesday", label: "Wed" },
    { id: "thursday", label: "Thu" },
    { id: "friday", label: "Fri" },
    { id: "saturday", label: "Sat" },
    { id: "sunday", label: "Sun" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Operating Hours & Live Status Controls</h2>
        <p className="text-xs text-neutral-400">
          Configure working hours, automated schedules, or trigger instant emergency closures.
        </p>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
      ) : garages.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-xs text-neutral-500">
          No garages found. Please add a parking space first.
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl space-y-6">
          {message && (
            <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 text-xs text-teal-300">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* Garage Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Select Parking Space
            </label>
            <select
              value={selectedGarageId}
              onChange={(e) => handleGarageChange(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-xs text-white outline-none focus:border-teal-500"
            >
              {garages.map((g) => (
                <option key={g.garage_id} value={g.garage_id}>
                  {g.parking_space_name} ({g.parking_lot_address})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Real-time Status Overrides */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Live Status Override</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                    forceClosed
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {forceClosed ? "Closed (Force)" : "Open for Bookings"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForceClosed(false);
                    setCurrentStatus("available");
                  }}
                  className={`rounded-lg py-2 text-xs font-semibold transition ${
                    !forceClosed && currentStatus === "available"
                      ? "bg-emerald-500 text-neutral-950 shadow-sm"
                      : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  ● Available
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForceClosed(false);
                    setCurrentStatus("busy");
                  }}
                  className={`rounded-lg py-2 text-xs font-semibold transition ${
                    !forceClosed && currentStatus === "busy"
                      ? "bg-amber-500 text-neutral-950 shadow-sm"
                      : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  ● Busy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForceClosed(true);
                    setCurrentStatus("closed");
                  }}
                  className={`rounded-lg py-2 text-xs font-semibold transition ${
                    forceClosed
                      ? "bg-red-500 text-white shadow-sm"
                      : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  ● Force Closed
                </button>
              </div>

              {forceClosed && (
                <div className="pt-2">
                  <label className="block text-[11px] text-neutral-400 mb-1">Reason for Closure</label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Maintenance, Heavy rain, or Private event"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                  />
                </div>
              )}
            </div>

            {/* Operating Schedule Section */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">24/7 Continuous Access</div>
                  <div className="text-[11px] text-neutral-400">Keep space open all day, every day</div>
                </div>
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
                <>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800/80">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Daily Opening Time</label>
                      <input
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Daily Closing Time</label>
                      <input
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-2">Operating Days</label>
                    <div className="flex flex-wrap gap-2">
                      {daysList.map((day) => {
                        const active = operatingDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              active
                                ? "bg-teal-500 text-neutral-950 shadow-sm"
                                : "border border-neutral-800 bg-neutral-900 text-neutral-500 hover:text-white"
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-teal-500/20 hover:opacity-95 disabled:opacity-50"
            >
              {saving ? "Saving Schedule..." : "Save Schedule & Controls ⚡"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
