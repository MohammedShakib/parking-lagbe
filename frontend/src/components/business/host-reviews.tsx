"use client";

import { useEffect, useState } from "react";

interface ReviewItem {
  id: number;
  garage_id: string;
  garage_name: string | null;
  rater_username: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

interface SummaryItem {
  garage_id: string;
  garage_name: string | null;
  total_ratings: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export function HostReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/business/reviews");
        const data = await res.json();
        if (!ignore && data.success) {
          setReviews(data.reviews || []);
          setSummaries(data.summaries || []);
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

  const overallAvg =
    summaries.length > 0
      ? (
          summaries.reduce((acc, s) => acc + Number(s.average_rating), 0) /
          summaries.length
        ).toFixed(1)
      : "5.0";

  const totalCount = summaries.reduce((acc, s) => acc + (s.total_ratings || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Driver Feedback & Ratings</h2>
        <p className="text-xs text-neutral-400">
          Inspect customer reviews and satisfaction scores across your parking portfolio.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <div className="h-44 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          <div className="h-64 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Scorecard */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-amber-950/20 p-6 shadow-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Overall Rating Average
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-400">{overallAvg}</span>
                  <span className="text-sm font-semibold text-neutral-500">/ 5.0</span>
                </div>
                <p className="mt-1 text-xs text-neutral-400">
                  Calculated from {totalCount} driver reviews.
                </p>
              </div>
              <div className="text-5xl text-amber-400/80">★</div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-xl">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Garage Rating Summary
              </h4>
              <div className="space-y-2 text-xs">
                {summaries.map((s) => (
                  <div key={s.garage_id} className="flex justify-between items-center text-neutral-300">
                    <span className="truncate max-w-[200px]">{s.garage_name || s.garage_id}</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      ★ {s.average_rating} <span className="text-neutral-500 font-normal">({s.total_ratings})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">Customer Reviews</h3>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-neutral-500">
                No customer reviews submitted yet. When drivers complete parking sessions, their feedback will appear here.
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {reviews.map((r) => (
                  <div key={r.id} className="py-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">@{r.rater_username}</span>
                        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          ★ {r.rating}/5
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      &ldquo;{r.review_text || "Great parking experience, safe and spacious."}&rdquo;
                    </p>
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
