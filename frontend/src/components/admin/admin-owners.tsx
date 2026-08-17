"use client";

import { useEffect, useState } from "react";

interface AdminOwner {
  owner_id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  is_verified: boolean;
  account_status: "active" | "suspended";
  commission_rate: number;
  garages_count: number;
}

export function AdminOwners() {
  const [owners, setOwners] = useState<AdminOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOwnerId, setUpdatingOwnerId] = useState<string | null>(null);

  const fetchOwners = async () => {
    try {
      const res = await fetch("/api/admin/owners");
      const data = await res.json();
      if (data.owners) {
        setOwners(data.owners);
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
        const res = await fetch("/api/admin/owners");
        const data = await res.json();
        if (!ignore && data.owners) {
          setOwners(data.owners);
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

  const handleToggleVerification = async (ownerId: string, current: boolean) => {
    setUpdatingOwnerId(ownerId);
    try {
      const res = await fetch("/api/admin/owners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, isVerified: !current }),
      });
      if (res.ok) {
        fetchOwners();
      }
    } catch {
      // Handled
    } finally {
      setUpdatingOwnerId(null);
    }
  };

  const handleSetCommission = async (ownerId: string, rate: number) => {
    setUpdatingOwnerId(ownerId);
    try {
      const res = await fetch("/api/admin/owners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, commissionRate: rate }),
      });
      if (res.ok) {
        fetchOwners();
      }
    } catch {
      // Handled
    } finally {
      setUpdatingOwnerId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Space Hosts & Commission Rates</h2>
        <p className="text-xs text-neutral-400">
          Manage host business verification, active status, and custom platform commission overrides.
        </p>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
      ) : owners.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-xs text-neutral-500">
          No registered garage hosts found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Host & Owner ID</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Garages</th>
                <th className="px-4 py-3">Commission Split</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {owners.map((o) => (
                <tr key={o.owner_id} className="hover:bg-neutral-800/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">@{o.username}</div>
                    <div className="font-mono text-[10px] text-neutral-500">{o.owner_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{o.name}</div>
                    <div className="text-[11px] text-neutral-500">{o.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-teal-400">{o.garages_count} Spaces</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{o.commission_rate}%</span>
                      <span className="text-[10px] text-neutral-500">(Platform)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        o.is_verified
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {o.is_verified ? "Verified Host ✓" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      disabled={updatingOwnerId === o.owner_id}
                      onClick={() => handleToggleVerification(o.owner_id, o.is_verified)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        o.is_verified
                          ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
                      }`}
                    >
                      {updatingOwnerId === o.owner_id ? "..." : o.is_verified ? "Revoke" : "Approve ✓"}
                    </button>
                    <button
                      disabled={updatingOwnerId === o.owner_id}
                      onClick={() => {
                        const newRate = prompt("Enter new commission rate percentage (e.g. 20 for 20%):", o.commission_rate.toString());
                        if (newRate && !isNaN(parseFloat(newRate))) {
                          handleSetCommission(o.owner_id, parseFloat(newRate));
                        }
                      }}
                      className="rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold text-neutral-200 hover:border-neutral-600"
                    >
                      Set Rate %
                    </button>
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
