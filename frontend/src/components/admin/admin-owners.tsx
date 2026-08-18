"use client";

import { useEffect, useState } from "react";
import { Search, Settings, Check, X, ShieldCheck, AlertCircle, FileText } from "lucide-react";

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
  const [query, setQuery] = useState("");
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
    if (!window.confirm(`Are you sure you want to ${isVerified ? 'verify' : 'revoke verification for'} this host?`)) return;

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

  const filtered = owners.filter((o) => {
    const q = query.toLowerCase();
    return (
      o.first_name.toLowerCase().includes(q) ||
      o.last_name.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.username.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] mb-1">Host Verification</h1>
          <p className="text-sm text-slate-500">
            Review {owners.length} registered hosts and manage their platform fee rates.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hosts..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5EAF0] text-sm text-slate-900 rounded-lg outline-none focus:border-[#149fe8]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 rounded-xl bg-slate-100 border border-[#E5EAF0] animate-pulse" />
      ) : (
        <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm text-slate-600 min-w-[900px]">
            <thead className="bg-[#F7F9FC] text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-[#E5EAF0]">
              <tr>
                <th className="px-6 py-4">Host Details</th>
                <th className="px-6 py-4">Platform Identity</th>
                <th className="px-6 py-4">Documentation</th>
                <th className="px-6 py-4">Revenue Split</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No hosts found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.owner_id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3">
                      <div className="font-semibold text-slate-900">
                        {o.first_name} {o.last_name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{o.email}</div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="text-slate-900 font-medium">@{o.username}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {o.owner_id.substring(0, 8)}...</div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">NID:</span> {o.nid_number || "Not Provided"}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">TL:</span> {o.trade_license_number || "Residential"}
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="text-xs font-semibold text-slate-900">
                        Platform: <span className="text-[#0b1f33]">{o.commission_rate.toFixed(1)}%</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                        Host Net: {(100 - o.commission_rate).toFixed(1)}%
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          o.is_verified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {o.is_verified ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {o.is_verified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingOwner(o);
                            setCommissionRate(o.commission_rate);
                          }}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 border border-[#E5EAF0] bg-white hover:bg-slate-50 rounded transition flex items-center gap-1.5"
                        >
                          <Settings className="w-3.5 h-3.5" /> Rate
                        </button>

                        {!o.is_verified ? (
                          <button
                            onClick={() => handleVerify(o.owner_id, true)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition border border-emerald-100"
                            title="Verify Host"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerify(o.owner_id, false)}
                            className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded transition border border-transparent"
                            title="Revoke Verification"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Commission Modal */}
      {editingOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#E5EAF0] bg-white p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Edit Platform Commission</h3>
              <p className="text-sm text-slate-500 mt-1">
                Configure rate for {editingOwner.first_name} {editingOwner.last_name}.
              </p>
            </div>

            <form onSubmit={handleSaveCommission} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Platform Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-[#E5EAF0] bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#149fe8]"
                />
              </div>

              <div className="bg-[#F7F9FC] p-3.5 rounded-lg border border-[#E5EAF0] flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Host Net Payout</span>
                <span className="text-sm font-bold text-emerald-600">{(100 - commissionRate).toFixed(1)}%</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOwner(null)}
                  className="flex-1 rounded-lg border border-[#E5EAF0] bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRate}
                  className="flex-1 rounded-lg bg-[#0b1f33] hover:bg-[#162d47] text-white py-2.5 text-sm font-semibold transition disabled:opacity-50"
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
