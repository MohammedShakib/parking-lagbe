"use client";

import { useEffect, useState } from "react";

interface AdminPaymentItem {
  payment_id: number;
  booking_id: number;
  username: string;
  payment_method: string;
  amount: number;
  payment_status: "pending" | "paid" | "refunded";
  transaction_id: string | null;
  payment_date: string;
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
        const data = await res.json();
        if (!ignore && data.payments) {
          setPayments(data.payments);
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
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Platform Payments & Commission Audit</h2>
        <p className="text-xs text-neutral-400">
          Complete ledger of driver payments, transaction reference IDs, and financial splits.
        </p>
      </div>

      {loading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-xs text-neutral-500">
          No payments recorded in the system yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Txn & Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Gross Total</th>
                <th className="px-4 py-3">Host Payout (70%)</th>
                <th className="px-4 py-3">Platform Share (30%)</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-300">
              {payments.map((p) => (
                <tr key={p.payment_id} className="hover:bg-neutral-800/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-mono text-white font-bold">
                      {p.transaction_id || `TXN_${p.payment_id}`}
                    </div>
                    <div className="text-[11px] text-neutral-500">Booking #{p.booking_id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">@{p.username}</div>
                    <div className="font-mono text-[10px] text-teal-400">{p.license_plate}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[10px] uppercase font-bold text-neutral-300">
                      {p.payment_method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <strong className="text-white">৳{p.amount}</strong>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-teal-400">৳{p.owner_profit}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-indigo-400">৳{p.platform_profit}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-[11px]">
                    {new Date(p.payment_date).toLocaleString()}
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
