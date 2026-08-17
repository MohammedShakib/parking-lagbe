"use client";

import { useEffect, useState } from "react";

interface AdminOwnerItem {
  owner_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  commission_rate: number;
  trade_license_number: string | null;
  nid_number: string | null;
}

export function AdminOwners() {
  const [owners, setOwners] = useState<AdminOwnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOwner, setEditingOwner] = useState<AdminOwnerItem | null>(null);
  const [commissionRate, setCommissionRate] = useState<number>(30);
  const [savingRate, setSavingRate] = useState(false);

  const fetchOwners = async () => {
    try {
      setLoading(true);
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

  const handleVerify = async (ownerId: string, isVerified: boolean) => {
    try {
      const res = await fetch("/api/admin/owners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, isVerified }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update owner verification");
      }

      fetchOwners();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error verifying host");
    }
  };

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOwner) return;

    setSavingRate(true);
    try {
      const res = await fetch("/api/admin/owners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: editingOwner.owner_id,
          commissionRate: parseFloat(commissionRate.toString()),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update commission rate");
      }

      setEditingOwner(null);
      fetchOwners();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving rate");
    } finally {
      setSavingRate(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Space Host Verifications & Commission Rates</h2>
        <p className="text-xs text-slate-500">
          Review host NID/trade credentials, grant business verification, and configure custom profit split overrides.
        </p>
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
      ) : owners.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-xs text-slate-500">No registered hosts found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Host Name</th>
                <th className="p-4">Owner ID & User</th>
                <th className="p-4">NID / Trade License</th>
                <th className="p-4">Platform Fee Rate</th>
                <th className="p-4">Host Net Rate</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {owners.map((o) => (
                <tr key={o.owner_id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">
                      {o.first_name} {o.last_name}
                    </div>
                    <div className="text-slate-500 text-[11px]">{o.email}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-mono text-slate-900">#{o.owner_id}</div>
                    <div className="text-slate-500 text-[11px]">@{o.username}</div>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-700">
                    <div>NID: {o.nid_number || "Verified"}</div>
                    <div className="text-slate-400">TL: {o.trade_license_number || "Residential"}</div>
                  </td>

                  <td className="p-4 font-bold text-[#d97706]">
                    {o.commission_rate.toFixed(1)}%
                  </td>

                  <td className="p-4 font-bold text-emerald-600">
                    {(100 - o.commission_rate).toFixed(1)}%
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        o.is_verified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {o.is_verified ? "Verified Host ✓" : "Pending Review"}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingOwner(o);
                        setCommissionRate(o.commission_rate);
                      }}
                      className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
                    >
                      ⚙️ Rate
                    </button>

                    {!o.is_verified ? (
                      <button
                        onClick={() => handleVerify(o.owner_id, true)}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition"
                      >
                        ✓ Verify
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerify(o.owner_id, false)}
                        className="rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-3 py-1.5 text-xs font-medium text-slate-700 transition border border-slate-200"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Commission Editor Modal in White Theme */}
      {editingOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Edit Host Commission Rate
            </h3>
            <p className="text-xs text-slate-500">
              Custom platform fee percentage for {editingOwner.first_name} {editingOwner.last_name} (@{editingOwner.username}).
            </p>

            <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Platform Commission Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-bold outline-none focus:border-[#f39c12]"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Host Net Payout:</span>
                  <span className="font-bold text-emerald-600">
                    {(100 - commissionRate).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOwner(null)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRate}
                  className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-2 font-bold text-white shadow-md shadow-[#f39c12]/20 disabled:opacity-50"
                >
                  {savingRate ? "Saving..." : "Save Rate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
