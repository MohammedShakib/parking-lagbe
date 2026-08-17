"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  totalGrossRevenue: number;
  totalPlatformProfit: number;
  totalOwnerPayouts: number;
  totalBookings: number;
  totalUsers: number;
  totalGarages: number;
  unverifiedGarages: number;
  unverifiedOwners: number;
  totalSlots: number;
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        if (!ignore && json.success) {
          setData(json.analytics);
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
        <h2 className="text-xl font-bold text-slate-900">Platform Financial & Operations Analytics</h2>
        <p className="text-xs text-slate-500">
          Executive performance indicators, 30% platform profit tracking, and network safety queues.
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
          {/* Top KPI Cards in White Theme */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Platform Net Profit (30%) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Platform Profit (30%)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#d97706]">
                  ৳{(data?.totalPlatformProfit || 0).toFixed(0)}
                </span>
                <span className="text-xs text-[#d97706] font-bold">BDT</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Platform commission retained</p>
            </div>

            {/* Total Gross Platform Volume */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Gross Platform GMV
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  ৳{(data?.totalGrossRevenue || 0).toFixed(0)}
                </span>
                <span className="text-xs text-slate-400 font-semibold">BDT</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {data?.totalBookings || 0} total bookings settled
              </p>
            </div>

            {/* Total Host Net Payouts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Total Host Payouts (70%)
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600">
                  ৳{(data?.totalOwnerPayouts || 0).toFixed(0)}
                </span>
                <span className="text-xs text-emerald-600 font-bold">BDT</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Distributed to space hosts</p>
            </div>

            {/* Total Registered Accounts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Active Drivers & Hosts
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-blue-600">
                  {data?.totalUsers || 0}
                </span>
                <span className="text-xs text-blue-600 font-bold">Users</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Across {data?.totalGarages || 0} listed garages</p>
            </div>
          </div>

          {/* Action Required: Verification Queues in White Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-900">Pending Host NID & License Verifications</div>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Hosts awaiting identity & property document approvals
                </p>
              </div>
              <div className="text-2xl font-black text-[#d97706]">
                {data?.unverifiedOwners || 0}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-900">Pending Garage Safety Inspections</div>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Facilities waiting for compliance check before public display
                </p>
              </div>
              <div className="text-2xl font-black text-[#d97706]">
                {data?.unverifiedGarages || 0}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
