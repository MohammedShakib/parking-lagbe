"use client";

import { useEffect, useState } from "react";
import { Search, Download, FileText, CheckCircle2, Clock } from "lucide-react";

interface AdminPaymentItem {
  payment_id: number;
  booking_id: number;
  transaction_id: string | null;
  amount: number;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  points_used: number;
  garage_id: string;
  license_plate: string;
  duration: number;
  platform_profit: number;
  owner_profit: number;
  commission_rate: number;
}

export function AdminPayments() {
  const [payments, setPayments] = useState<AdminPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/payments");
        const json = await res.json();
        if (!ignore && json.success) {
          setPayments(json.payments || []);
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

  const filtered = payments.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.transaction_id?.toLowerCase().includes(q) ||
      p.payment_method.toLowerCase().includes(q) ||
      p.license_plate.toLowerCase().includes(q) ||
      `bk-${p.booking_id}`.includes(q) ||
      `pay-${p.payment_id}`.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] mb-1">Financial Ledger & Transactions</h1>
          <p className="text-sm text-slate-500">
            Immutable log of all platform payments and host payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, method, or plate..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5EAF0] text-sm text-slate-900 rounded-lg outline-none focus:border-[#149fe8]"
            />
          </div>
          <button className="bg-white border border-[#E5EAF0] text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 rounded-xl bg-slate-100 border border-[#E5EAF0] animate-pulse" />
      ) : (
        <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm text-slate-600 min-w-[950px]">
            <thead className="bg-[#F7F9FC] text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-[#E5EAF0]">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Booking Ref</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Method & Vehicle</th>
                <th className="px-6 py-4">Gross Paid</th>
                <th className="px-6 py-4">Platform Share</th>
                <th className="px-6 py-4">Host Net</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF0]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No transactions found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3 font-mono">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        PAY-{p.payment_id}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 pl-5">{p.transaction_id || "TXN-AUTO"}</div>
                    </td>

                    <td className="px-6 py-3 font-mono font-medium text-[#149fe8]">
                      BK-{p.booking_id}
                    </td>

                    <td className="px-6 py-3 text-xs text-slate-500">
                      {new Date(p.payment_date).toLocaleString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>

                    <td className="px-6 py-3">
                      <div className="capitalize font-medium text-slate-900">{p.payment_method}</div>
                      <div className="text-[11px] mt-1">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600 border border-[#E5EAF0]">
                          {p.license_plate}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3 font-semibold text-slate-900">
                      ৳{p.amount.toFixed(2)}
                    </td>

                    <td className="px-6 py-3">
                      <div className="font-semibold text-[#0b1f33]">
                        ৳{p.platform_profit.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {p.commission_rate.toFixed(0)}% Fee
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="font-semibold text-emerald-600">
                        ৳{p.owner_profit.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {(100 - p.commission_rate).toFixed(0)}% Payout
                      </div>
                    </td>

                    <td className="px-6 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                          p.payment_status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {p.payment_status === "paid" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="capitalize">{p.payment_status}</span>
                      </span>
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
