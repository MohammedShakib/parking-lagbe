"use client";

import { useEffect, useState } from "react";

interface PointsTransaction {
  id: number;
  transaction_type: "earned" | "spent" | "refunded" | "adjustment";
  points_amount: number;
  description: string | null;
  booking_id: number | null;
  created_at: string;
}

interface PointsData {
  points: number;
  total_earned: number;
  user_level: string;
  tier_progress: {
    currentTier: string;
    nextTier: string;
    pointsToNextTier: number;
    progressPercent: number;
  };
  transactions: PointsTransaction[];
}

export function PointsLedger() {
  const [data, setData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/points");
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

  const userLevelIcon =
    data?.user_level === "diamond"
      ? "💎"
      : data?.user_level === "gold"
      ? "🏆"
      : "⭐";

  // Calculate free hours available (150 pts = 1 hr)
  const freeHoursAvailable = Math.floor((data?.points || 0) / 150);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Loyalty Points & VIP Rewards</h2>
        <p className="text-slate-500 text-xs">
          Earn points on every parking booking. Redeem 150 points for 1 hour of free parking or upgrade VIP tier.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6">
          <div className="h-44 animate-pulse rounded-2xl bg-slate-100 border border-slate-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-slate-100 border border-slate-200" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPI Cards in White Theme */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Available Balance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Current Points</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#d97706]">
                  {data?.points.toLocaleString()}
                </span>
                <span className="text-xs text-[#d97706] font-bold">PTS</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Ready to redeem on next booking</p>
            </div>

            {/* Lifetime Earned */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Lifetime Earned</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">
                  {data?.total_earned.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-semibold">PTS</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">Total earned from completed trips</p>
            </div>

            {/* Free Hours Available */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Free Parking Hours</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600">
                  {freeHoursAvailable}
                </span>
                <span className="text-xs text-emerald-600 font-bold">Hours</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">150 PTS = 1 Hour Free Parking</p>
            </div>

            {/* Current VIP Tier */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">VIP Loyalty Tier</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl">{userLevelIcon}</span>
                <span className="text-2xl font-black text-slate-900 capitalize">
                  {data?.user_level || "Bronze"}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {data?.tier_progress?.pointsToNextTier
                  ? `${data.tier_progress.pointsToNextTier} pts to ${data.tier_progress.nextTier}`
                  : "Maximum VIP Status Achieved"}
              </p>
            </div>
          </div>

          {/* Tier Progression Progress Bar */}
          {data?.tier_progress && data.tier_progress.nextTier !== "Diamond Max" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Tier Upgrade Progress: {data.tier_progress.currentTier} → {data.tier_progress.nextTier}
                </span>
                <span className="font-bold text-[#d97706]">
                  {data.tier_progress.progressPercent}% Completed
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-[#f39c12] to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, data.tier_progress.progressPercent))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Bronze (15 pts)</span>
                <span>Gold (100 pts)</span>
                <span>Diamond (161+ pts)</span>
              </div>
            </div>
          )}

          {/* Points Transactions History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Points Activity Ledger</h3>
              <p className="text-xs text-slate-500">Recent point accruals, milestone bonuses, and redemption records</p>
            </div>

            {data?.transactions && data.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4">Type</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Booking Ref</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.transactions.map((tx) => {
                      const isEarned = tx.transaction_type === "earned";

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50 transition">
                          <td className="p-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                                isEarned
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {tx.transaction_type.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-slate-900">{tx.description || "Parking Reservation"}</td>
                          <td className="p-4 font-mono text-slate-500">
                            {tx.booking_id ? `#BK-${tx.booking_id}` : "System"}
                          </td>
                          <td className="p-4 text-slate-500">{new Date(tx.created_at).toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <span
                              className={`font-bold text-sm ${
                                isEarned ? "text-emerald-600" : "text-[#d97706]"
                              }`}
                            >
                              {isEarned ? `+${tx.points_amount}` : `-${tx.points_amount}`} PTS
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">
                No point transactions recorded yet. Complete parking bookings to start earning rewards!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
