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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Loyalty Rewards & Points Ledger</h2>
        <p className="text-xs text-neutral-400">
          Earn 1 point for every ৳10 spent. Redeem points on parking reservations or unlock VIP tiers.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <div className="h-44 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tier Status Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Available Balance */}
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-amber-950/20 p-5 shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Available Balance
              </div>
              <div className="mt-2 text-3xl font-black text-amber-400">
                {data?.points.toLocaleString()} <span className="text-sm font-semibold">pts</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Worth <strong>৳{data?.points}</strong> discount on any parking reservation.
              </p>
            </div>

            {/* Total Lifetime Earned */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Lifetime Points Earned
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {data?.total_earned.toLocaleString()} <span className="text-sm font-semibold">pts</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                Calculated across all completed and paid bookings.
              </p>
            </div>

            {/* Loyalty Tier Progress */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Current Tier
                </span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold capitalize text-amber-400 border border-amber-500/30">
                  {data?.user_level} VIP
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-neutral-400 mb-1">
                  <span>Target: {data?.tier_progress.nextTier}</span>
                  <span>{data?.tier_progress.progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                    style={{ width: `${data?.tier_progress.progressPercent}%` }}
                  />
                </div>
                {data?.tier_progress.pointsToNextTier ? (
                  <p className="mt-2 text-[11px] text-neutral-400">
                    Need <strong>{data.tier_progress.pointsToNextTier} more pts</strong> to reach {data.tier_progress.nextTier}.
                  </p>
                ) : (
                  <p className="mt-2 text-[11px] text-emerald-400 font-semibold">
                    ⭐ Highest Tier unlocked!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Points Transactions History */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Points Activity & Ledger</h3>

            {!data?.transactions || data.transactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-neutral-500">
                No points transactions recorded yet. Complete bookings to earn reward points.
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {data.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                          tx.transaction_type === "earned"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {tx.transaction_type === "earned" ? "+" : "-"}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {tx.description || `${tx.transaction_type.toUpperCase()} Points`}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {new Date(tx.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-sm font-bold ${
                        tx.transaction_type === "earned" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {tx.transaction_type === "earned" ? "+" : "-"}
                      {tx.points_amount} pts
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
