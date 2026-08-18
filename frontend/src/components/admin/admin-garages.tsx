"use client";

import { useEffect, useState } from "react";
import { Search, MoreHorizontal, Check, X, ShieldCheck, AlertCircle, Building2, MapPin } from "lucide-react";

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
  const [query, setQuery] = useState("");

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
    if (!window.confirm(`Are you sure you want to ${isVerified ? 'approve' : 'suspend'} this facility?`)) return;

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

  const filtered = garages.filter((g) => {
    const q = query.toLowerCase();
    return (
      g.parking_space_name.toLowerCase().includes(q) ||
      g.parking_lot_address.toLowerCase().includes(q) ||
      g.username.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] mb-1">Parking Locations</h1>
          <p className="text-sm text-slate-500">
            {garages.length} total parking facilities
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search facilities..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5EAF0] text-sm text-slate-900 rounded-lg outline-none focus:border-[#149fe8]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 rounded-xl bg-slate-100 border border-[#E5EAF0] animate-pulse" />
      ) : (
        <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
            <thead className="bg-[#F7F9FC] text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-[#E5EAF0]">
              <tr>
                <th className="px-6 py-4">Facility & Location</th>
                <th className="px-6 py-4">Host</th>
                <th className="px-6 py-4">Capacity & Rate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No parking locations found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.garage_id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div className="font-semibold text-slate-900">{g.parking_space_name}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{g.parking_lot_address}</div>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <span className="font-semibold text-slate-900">@{g.username}</span>
                    </td>

                    <td className="px-6 py-3">
                      <div className="font-semibold text-slate-900">{g.parking_capacity} <span className="font-normal text-slate-500">slots</span></div>
                      <div className="text-[11px] text-[#0b1f33] font-medium mt-0.5">৳{g.price_per_hour}/hr</div>
                    </td>

                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {g.real_time_status?.force_closed ? "Offline" : "Active"}
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          g.is_verified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {g.is_verified ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {g.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!g.is_verified ? (
                          <button
                            onClick={() => handleVerify(g.garage_id, true)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition border border-emerald-100"
                            title="Approve Facility"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(g.garage_id, false)}
                            className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded transition border border-transparent"
                            title="Suspend Facility"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded transition" title="View Details">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
