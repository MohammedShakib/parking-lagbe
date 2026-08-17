"use client";

import { useState } from "react";

interface RatingModalProps {
  bookingId: number;
  garageId: string;
  garageName: string;
  onClose: () => void;
  onRatingSuccess: () => void;
}

export function RatingModal({
  bookingId,
  garageId,
  garageName,
  onClose,
  onRatingSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          garageId,
          rating,
          reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      onRatingSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting review";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          ✕
        </button>

        <div className="mb-4">
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
            Share Your Experience
          </span>
          <h2 className="mt-2 text-xl font-bold text-white">Rate {garageName}</h2>
          <p className="text-xs text-neutral-400">Booking #{bookingId}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="flex flex-col items-center justify-center py-3">
            <div className="flex items-center gap-2 text-3xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <span
                    className={
                      (hoverRating || rating) >= star
                        ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                        : "text-neutral-700"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <span className="mt-2 text-xs font-semibold text-neutral-300">
              {rating === 5 && "⭐ Excellent - Highly Recommended"}
              {rating === 4 && "👍 Very Good - Clean & Safe"}
              {rating === 3 && "👌 Average - Acceptable"}
              {rating === 2 && "👎 Poor - Issues encountered"}
              {rating === 1 && "⚠️ Terrible - Avoid"}
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">
              Feedback / Review (Optional)
            </label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="How was the space security, entry clearance, and ease of parking?"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-amber-500/20 transition hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Post Review & Rating ★"}
          </button>
        </form>
      </div>
    </div>
  );
}
