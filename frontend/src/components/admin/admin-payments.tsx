"use client";

import { useEffect, useState } from "react";

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Complete Platform Financial Audit Ledger</h2>
        <p className="text-xs text-slate-500">
          Immutable payment transaction logs with platform 30% profit and host 70% payout breakdowns.
        </p>
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
      ) : payments.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-xs text-slate-500">No transaction records found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Payment ID / Txn</th>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Method & Vehicle</th>
                <th className="p-4">Gross Paid</th>
                <th className="p-4">Platform Share</th>
                <th className="p-4">Host Payout</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.payment_id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono">
                    <div className="font-bold text-slate-900">#PAY-{p.payment_id}</div>
                    <div className="text-[10px] text-slate-400">{p.transaction_id || "TXN-AUTO"}</div>
                  </td>

                  <td className="p-4 font-mono font-semibold text-slate-700">
                    #BK-{p.booking_id}
                  </td>

                  <td className="p-4 text-slate-500">
                    {new Date(p.payment_date).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <div className="capitalize font-semibold text-slate-900">{p.payment_method}</div>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                      {p.license_plate}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    ৳{p.amount.toFixed(2)}
                  </td>

                  <td className="p-4 font-bold text-[#d97706]">
                    +৳{p.platform_profit.toFixed(2)}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ({p.commission_rate.toFixed(0)}%)
                    </span>
                  </td>

                  <td className="p-4 font-bold text-emerald-600">
                    ৳{p.owner_profit.toFixed(2)}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      ({(100 - p.commission_rate).toFixed(0)}%)
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        p.payment_status === "paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {p.payment_status.toUpperCase()}
                    </span>
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
