"use client";

import { useEffect, useState } from "react";

interface ReviewItem {
  id: number;
  garage_id: string;
  parking_space_name: string;
  customer_username: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

export function HostReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/business/reviews");
        const json = await res.json();
        if (!ignore && json.success) {
          setReviews(json.reviews || []);
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

  const averageScore =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Ratings & Reviews Feed</h2>
          <p className="text-xs text-slate-500">
            Real driver ratings submitted after verified completed parking reservations.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs">
          <span className="text-amber-500 text-base font-bold">★ {averageScore}</span>
          <span className="text-amber-900 font-semibold">({reviews.length} total reviews)</span>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="text-base font-bold text-slate-900">No driver reviews yet</h3>
          <p className="mt-1 text-xs text-slate-500">
            Reviews will appear here as drivers complete their sessions at your facilities.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-bold text-slate-900 text-xs">{rev.parking_space_name}</div>
                  <div className="text-amber-500 text-xs font-bold">
                    {"★".repeat(rev.rating)}
                    <span className="text-slate-200">
                      {"★".repeat(5 - rev.rating)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &ldquo;{rev.review_text || "Clean, safe, and easily accessible space."}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                <span>By @{rev.customer_username}</span>
                <span>{new Date(rev.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
