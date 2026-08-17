"use client";

import { useEffect, useState } from "react";

import { HostGarage } from "./garage-portfolio";

interface ScheduleControlsProps {
  selectedGarage: HostGarage | null;
}

export function ScheduleControls({ selectedGarage }: ScheduleControlsProps) {
  const [garages, setGarages] = useState<HostGarage[]>([]);
  const [activeGarageId, setActiveGarageId] = useState<string>(
    selectedGarage?.garage_id || ""
  );

  const [is24_7, setIs24_7] = useState(true);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [operatingDays, setOperatingDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);

  const [forceClosed, setForceClosed] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    let ignore = false;
    async function loadGarages() {
      try {
        const res = await fetch("/api/business/garages");
        const data = await res.json();
        if (!ignore && data.garages && data.garages.length > 0) {
          setGarages(data.garages);
          const initialId = activeGarageId || data.garages[0].garage_id;
          setActiveGarageId(initialId);
          const g = data.garages.find((item: HostGarage) => item.garage_id === initialId) || data.garages[0];
          if (g) {
            setIs24_7(g.schedule?.is_24_7 ?? true);
            setOpeningTime(g.schedule?.opening_time || "06:00");
            setClosingTime(g.schedule?.closing_time || "22:00");
            setOperatingDays(
              g.schedule?.operating_days || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            );
            setForceClosed(g.real_time_status?.force_closed ?? false);
            setOverrideReason(g.real_time_status?.override_reason || "");
          }
        }
      } catch {
        // Handled
      }
    }
    loadGarages();
    return () => {
      ignore = true;
    };
  }, [activeGarageId]);

  const handleGarageChange = (garageId: string) => {
    setActiveGarageId(garageId);
    const g = garages.find((item) => item.garage_id === garageId);
    if (g) {
      setIs24_7(g.schedule?.is_24_7 ?? true);
      setOpeningTime(g.schedule?.opening_time || "06:00");
      setClosingTime(g.schedule?.closing_time || "22:00");
      setOperatingDays(
        g.schedule?.operating_days || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      );
      setForceClosed(g.real_time_status?.force_closed ?? false);
      setOverrideReason(g.real_time_status?.override_reason || "");
    }
  };

  const toggleDay = (day: string) => {
    if (operatingDays.includes(day)) {
      if (operatingDays.length === 1) return; // Must have at least 1 day
      setOperatingDays(operatingDays.filter((d) => d !== day));
    } else {
      setOperatingDays([...operatingDays, day]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGarageId) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/business/garages/${activeGarageId}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is24_7,
          openingTime,
          closingTime,
          operatingDays,
          forceClosed,
          overrideReason: forceClosed ? overrideReason : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update schedule");
      }

      setMessage({ text: "Schedule and live override saved successfully!", type: "success" });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Operating Schedule & Live Controls</h2>
        <p className="text-xs text-slate-500">
          Configure working hours, weekly open days, and emergency force-close overrides.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <span>{message.type === "success" ? "✓" : "⚠️"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {garages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-xs text-slate-500">No parking spaces listed. Add a space first.</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Facility Selector */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Parking Facility
            </label>
            <select
              value={activeGarageId}
              onChange={(e) => handleGarageChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-900 outline-none focus:border-[#f39c12]"
            >
              {garages.map((g) => (
                <option key={g.garage_id} value={g.garage_id}>
                  {g.parking_space_name} ({g.parking_lot_address})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Schedule Card in White Theme */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>⏱️</span>
                <span>Weekly Hours & Operating Days</span>
              </h3>

              {/* 24/7 Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-xs">24/7 Continuous Operation</div>
                  <div className="text-[11px] text-slate-500">Open non-stop every day and night</div>
                </div>
                <input
                  type="checkbox"
                  checked={is24_7}
                  onChange={(e) => setIs24_7(e.target.checked)}
                  className="w-5 h-5 accent-[#f39c12] cursor-pointer"
                />
              </div>

              {!is24_7 && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-700 font-bold text-[11px] mb-1">Opening Time</label>
                    <input
                      type="time"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold text-[11px] mb-1">Closing Time</label>
                    <input
                      type="time"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Operating Days */}
              <div>
                <label className="block text-slate-700 font-bold text-xs mb-2">Open Days</label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map((day) => {
                    const isSelected = operatingDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isSelected
                            ? "bg-[#f39c12] text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Emergency Live Override Card in White Theme */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>🚨</span>
                <span>Emergency Manual Override</span>
              </h3>

              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-rose-900 text-xs">Force Temporary Closure</div>
                    <div className="text-[11px] text-rose-700">Instantly stops new reservations</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={forceClosed}
                    onChange={(e) => setForceClosed(e.target.checked)}
                    className="w-5 h-5 accent-rose-600 cursor-pointer"
                  />
                </div>

                {forceClosed && (
                  <div>
                    <label className="block text-rose-900 font-bold text-[11px] mb-1">
                      Reason for Closure (Shown to drivers)
                    </label>
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="e.g. Maintenance, Gate repair, Private event"
                      className="w-full rounded-xl border border-rose-300 bg-white px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Use manual override if unexpected maintenance, construction, or private reservations require you to halt driver bookings immediately.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-[#f39c12] hover:bg-[#e67e22] py-3.5 font-bold text-white text-xs shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50"
          >
            {saving ? "Saving Schedule..." : "Save Operating Controls"}
          </button>
        </form>
      )}
    </div>
  );
}
