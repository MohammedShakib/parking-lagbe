"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  total_users: number;
  total_owners: number;
  total_garages: number;
  total_bookings: number;
  total_gross: number;
  platform_profit: number;
  owner_profit: number;
  pending_garages: number;
  pending_owners: number;
  pending_users: number;
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
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Platform Analytics & Financial Overview</h2>
        <p className="text-xs text-neutral-400">
          Executive performance summary of the Parking Lagbe platform ecosystem across Dhaka.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-indigo-950/30 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Platform Profit (30%)
              </div>
              <div className="mt-2 text-3xl font-black text-indigo-400">
                ৳{data?.platform_profit.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">Net revenue earned by platform.</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Gross Transaction Volume
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                ৳{data?.total_gross.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">
                Across {data?.total_bookings} total customer bookings.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Host Payouts (70%)
              </div>
              <div className="mt-2 text-3xl font-black text-teal-400">
                ৳{data?.owner_profit.toLocaleString()}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">Disbursed to verified garage owners.</p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Garages & Spaces
              </div>
              <div className="mt-2 text-3xl font-black text-amber-400">
                {data?.total_garages}
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">
                {data?.pending_garages ? `${data.pending_garages} pending verification` : "All verified"}
              </p>
            </div>
          </div>

          {/* Quick Ecosystem Health Badges */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400">Registered Users</div>
                <div className="text-2xl font-bold text-white mt-1">{data?.total_users}</div>
              </div>
              <div className="text-3xl">👥</div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400">Space Hosts & Owners</div>
                <div className="text-2xl font-bold text-white mt-1">{data?.total_owners}</div>
              </div>
              <div className="text-3xl">🏢</div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400">Total Bookings</div>
                <div className="text-2xl font-bold text-white mt-1">{data?.total_bookings}</div>
              </div>
              <div className="text-3xl">🎫</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
