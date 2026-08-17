"use client";

import { useEffect, useState } from "react";

interface AdminGarageItem {
  id: number;
  garage_id: string;
  parking_space_name: string;
  parking_lot_address: string;
  parking_capacity: number;
  price_per_hour: number;
  is_verified: boolean;
  username: string;
  real_time_status?: {
    current_status: string;
    force_closed: boolean;
  };
}

export function AdminGarages() {
  const [garages, setGarages] = useState<AdminGarageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGarages = async () => {
    try {
      setLoading(true);
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

  const handleVerify = async (garageId: string, isVerified: boolean) => {
    try {
      const res = await fetch("/api/admin/garages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garageId, isVerified }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update garage verification");
      }

      fetchGarages();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating garage");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Garage Facility Compliance & Safety Approvals</h2>
        <p className="text-xs text-slate-500">
          Approve inspected parking spots for public discovery or suspend non-compliant facilities.
        </p>
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
      ) : garages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-xs text-slate-500">No garages found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Facility & Location</th>
                <th className="p-4">Owner Account</th>
                <th className="p-4">Capacity & Rate</th>
                <th className="p-4">Live Status</th>
                <th className="p-4">Safety Compliance</th>
                <th className="p-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {garages.map((g) => (
                <tr key={g.garage_id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{g.parking_space_name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{g.parking_lot_address}</div>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-900">@{g.username}</span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900">{g.parking_capacity} Slots</div>
                    <div className="text-[11px] text-[#d97706]">৳{g.price_per_hour}/hr</div>
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold border border-slate-200">
                      {g.real_time_status?.force_closed ? "Closed (Override)" : "Active"}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        g.is_verified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {g.is_verified ? "Approved ✓" : "Pending Inspection"}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {!g.is_verified ? (
                      <button
                        onClick={() => handleVerify(g.garage_id, true)}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition"
                      >
                        ✓ Approve Facility
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(g.garage_id, false)}
                        className="rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-3 py-1.5 text-xs font-medium text-slate-700 transition border border-slate-200"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
