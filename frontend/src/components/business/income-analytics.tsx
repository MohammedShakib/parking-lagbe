"use client";

import { useEffect, useState } from "react";

interface IncomeSummary {
  totalGrossRevenue: number;
  ownerNetEarnings: number;
  platformCommissions: number;
  totalSettledBookings: number;
  todayEarnings: number;
  todayBookings: number;
  recentPayouts: Array<{
    id: number;
    amount: number;
    owner_profit: number;
    platform_profit: number;
    commission_rate: number;
    payment_date: string;
    booking_id: number;
  }>;
}

export function IncomeAnalytics() {
  const [data, setData] = useState<IncomeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/business/income");
        const json = await res.json();
        if (!ignore && json.success) {
          setData(json.summary);
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
        <h2 className="text-xl font-bold text-slate-900">Revenue & Host Earnings Breakdown</h2>
        <p className="text-xs text-slate-500">
          Transparent financial analytics with guaranteed 70% host net payout on all parking transactions.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPI Cards in White Theme */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Host Net Earnings (70%) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Host Net Payout (70%)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600">
                  ৳{(data?.ownerNetEarnings || 0).toFixed(0)}
                </span>
                <span className="text-xs text-emerald-600 font-bold">BDT</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Your total net profit</p>
            </div>

            {/* Today's Earnings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Today&apos;s Earnings
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#d97706]">
                  ৳{(data?.todayEarnings || 0).toFixed(0)}
                </span>
                <span className="text-xs text-[#d97706] font-bold">BDT</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {data?.todayBookings || 0} booking(s) today
              </p>
            </div>

            {/* Total Gross Volume */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Total Gross Volume
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  ৳{(data?.totalGrossRevenue || 0).toFixed(0)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">BDT</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Across {data?.totalSettledBookings || 0} completed bookings
              </p>
            </div>

            {/* Platform Commission (30%) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Platform Fee (30%)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-400">
                  ৳{(data?.platformCommissions || 0).toFixed(0)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">BDT</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Platform maintenance & support</p>
            </div>
          </div>

          {/* Revenue Distribution Visualizer in White Theme */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">70/30 Profit Distribution Share</h3>

            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 flex">
              <div className="h-full bg-emerald-500 w-[70%]" title="Host Net Share: 70%" />
              <div className="h-full bg-amber-500 w-[30%]" title="Platform Share: 30%" />
            </div>

            <div className="flex justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-slate-900">Host Net Share: 70.0%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-slate-900">Platform Management: 30.0%</span>
              </div>
            </div>
          </div>

          {/* Recent Payout Settlements Table in White Theme */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Recent Settled Payouts</h3>
              <p className="text-xs text-slate-500">Audited settlement statements from completed driver sessions</p>
            </div>

            {data?.recentPayouts && data.recentPayouts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="border-b border-slate-200 bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
                    <tr>
                      <th className="p-4">Settlement Ref</th>
                      <th className="p-4">Booking Ref</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Gross Paid</th>
                      <th className="p-4">Platform Fee (30%)</th>
                      <th className="p-4 text-right">Host Net (70%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recentPayouts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-mono font-bold text-slate-900">#ST-{p.id}</td>
                        <td className="p-4 font-mono text-slate-500">#BK-{p.booking_id}</td>
                        <td className="p-4 text-slate-500">{new Date(p.payment_date).toLocaleString()}</td>
                        <td className="p-4 font-semibold text-slate-900">৳{p.amount.toFixed(2)}</td>
                        <td className="p-4 text-slate-500">৳{p.platform_profit.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <span className="font-black text-emerald-600 text-sm">
                            +৳{p.owner_profit.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">
                No payout transactions recorded yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
