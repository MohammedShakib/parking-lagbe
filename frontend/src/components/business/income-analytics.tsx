"use client";

import { useEffect, useState } from "react";

interface IncomeData {
  summary: {
    total_gross: number;
    net_payout: number;
    platform_commission: number;
    today_income: number;
    total_settled_bookings: number;
  };
  transactions: {
    id: number;
    payment_id: number;
    booking_id: number;
    garage_name: string;
    total_amount: number;
    commission_rate: number;
    owner_profit: number;
    platform_profit: number;
    created_at: string;
  }[];
}

export function IncomeAnalytics() {
  const [data, setData] = useState<IncomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/business/income");
        const json = await res.json();
        if (!ignore && json.success) {
          setData(json);
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
        <h2 className="text-xl font-bold text-white">Earnings & Income Analytics</h2>
        <p className="text-xs text-neutral-400">
          Track gross driver payments, net host payouts (70%), and platform commissions (30%).
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <div className="h-44 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-teal-950/20 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Net Host Payout (70%)
              </div>
              <div className="mt-2 text-3xl font-black text-teal-400">
                ৳{data?.summary.net_payout.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">Available for direct bank withdrawal.</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Gross Revenue
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                ৳{data?.summary.total_gross.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">
                Across {data?.summary.total_settled_bookings} settled bookings.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Platform Commission (30%)
              </div>
              <div className="mt-2 text-3xl font-black text-neutral-300">
                ৳{data?.summary.platform_commission.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">Includes payment fees and support.</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Today&apos;s Income
              </div>
              <div className="mt-2 text-3xl font-black text-emerald-400">
                ৳{data?.summary.today_income.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-neutral-400">Earnings since 12:00 AM today.</p>
            </div>
          </div>

          {/* Transactions Breakdown */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Settled Bookings & Profit Ledger</h3>

            {!data?.transactions || data.transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-neutral-500">
                No profit transactions recorded yet. Once drivers pay for bookings, settlements will appear here.
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {data.transactions.map((tx) => (
                  <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 text-xs">
                    <div>
                      <div className="font-semibold text-white">
                        {tx.garage_name} <span className="text-neutral-500 font-normal">• Booking #{tx.booking_id}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-[10px] text-neutral-500">Gross</div>
                        <div className="font-bold text-white">৳{tx.total_amount}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Commission (30%)</div>
                        <div className="text-neutral-400">-৳{tx.platform_profit}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-neutral-500">Your Share</div>
                        <div className="font-bold text-teal-400">৳{tx.owner_profit}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
