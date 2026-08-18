"use client";

import { useEffect, useState } from "react";
import { ArrowRight, AlertTriangle, ShieldAlert } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface AnalyticsData {
  totalGrossRevenue?: number;
  totalPlatformProfit?: number;
  totalOwnerPayouts?: number;
  totalBookings?: number;
  totalUsers?: number;
  totalGarages?: number;
  unverifiedGarages?: number;
  unverifiedOwners?: number;
  
  // Fallback mappings for API mismatch
  total_gross?: number;
  platform_profit?: number;
  owner_profit?: number;
  total_bookings?: number;
  total_users?: number;
  total_garages?: number;
  pending_garages?: number;
  pending_owners?: number;
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

  // Map API response correctly (since the API returns snake_case but old UI expected camelCase)
  const platformProfit = data?.platform_profit ?? data?.totalPlatformProfit ?? 0;
  const grossRevenue = data?.total_gross ?? data?.totalGrossRevenue ?? 0;
  const ownerPayouts = data?.owner_profit ?? data?.totalOwnerPayouts ?? 0;
  const totalBookings = data?.total_bookings ?? data?.totalBookings ?? 0;
  const totalUsers = data?.total_users ?? data?.totalUsers ?? 0;
  const totalGarages = data?.total_garages ?? data?.totalGarages ?? 0;
  const pendingGarages = data?.pending_garages ?? data?.unverifiedGarages ?? 0;
  const pendingOwners = data?.pending_owners ?? data?.unverifiedOwners ?? 0;

  const verifiedGarages = Math.max(0, totalGarages - pendingGarages);
  
  const networkData = [
    { name: "Verified & Active", value: verifiedGarages, color: "#10b981" },
    { name: "Pending Inspection", value: pendingGarages, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Row 1: Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Overview of Parking Lagbe operations, revenue, and platform activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-[#E5EAF0] text-sm text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-[#149fe8]">
            <option>All Time</option>
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-[#E5EAF0] bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 2: KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E5EAF0] rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-500 mb-2">Gross Revenue</div>
              <div className="text-2xl font-bold text-slate-900">৳{grossRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-[11px] text-slate-400 mt-1">{totalBookings} total bookings</div>
            </div>
            
            <div className="bg-white border border-[#E5EAF0] rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-500 mb-2">Platform Commission</div>
              <div className="text-2xl font-bold text-slate-900">৳{platformProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-[11px] text-slate-400 mt-1">30% platform share</div>
            </div>
            
            <div className="bg-white border border-[#E5EAF0] rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-500 mb-2">Host Payouts</div>
              <div className="text-2xl font-bold text-emerald-600">৳{ownerPayouts.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-[11px] text-slate-400 mt-1">70% host earnings</div>
            </div>
            
            <div className="bg-white border border-[#E5EAF0] rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-500 mb-2">Active Users</div>
              <div className="text-2xl font-bold text-[#149fe8]">{totalUsers.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400 mt-1">Registered accounts</div>
            </div>
          </div>

          {/* Row 3: Charts & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#E5EAF0] rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
              {/* No time series API available yet - showing message instead of fake data */}
              <div className="text-center space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Revenue & Booking Activity</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Time-series analytics data is not yet available from the backend. 
                  Once the API supports date grouping, the main chart will appear here.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E5EAF0] rounded-xl p-6 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Parking Network Status</h3>
              {totalGarages > 0 ? (
                <div className="flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={networkData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {networkData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5EAF0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0F172A', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {networkData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-[11px] text-slate-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  No parking network data.
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Requires Attention */}
          {(pendingGarages > 0 || pendingOwners > 0) && (
            <div className="bg-white border border-[#E5EAF0] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E5EAF0]">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Requires Attention
                </h2>
              </div>
              <div className="divide-y divide-[#E5EAF0]">
                {pendingOwners > 0 && (
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{pendingOwners} Pending Host Verifications</div>
                        <div className="text-xs text-slate-500">Hosts awaiting identity and document review</div>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-[#149fe8] hover:text-[#0b1f33] transition flex items-center gap-1">
                      Review <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {pendingGarages > 0 && (
                  <div className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{pendingGarages} Garage Safety Inspections Required</div>
                        <div className="text-xs text-slate-500">Facilities waiting for compliance check before going online</div>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-[#149fe8] hover:text-[#0b1f33] transition flex items-center gap-1">
                      Review <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
