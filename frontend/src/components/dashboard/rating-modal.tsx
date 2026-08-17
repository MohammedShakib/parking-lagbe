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
          garageId,
          bookingId,
          rating,
          reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit rating");
      }

      alert("Thank you for your feedback! Rating submitted.");
      onRatingSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting review";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Rate Parking Space</h3>
            <p className="text-xs text-slate-500">{garageName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Selection in White Theme */}
          <div className="text-center py-2">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <span
                    className={
                      (hoverRating || rating) >= star
                        ? "text-amber-400"
                        : "text-slate-200"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs font-bold text-slate-700">
              {rating === 5 && "⭐ Excellent Experience"}
              {rating === 4 && "👍 Good Space"}
              {rating === 3 && "👌 Average"}
              {rating === 2 && "👎 Below Average"}
              {rating === 1 && "⚠️ Poor Experience"}
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Review & Comments (Optional)
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about cleanliness, security, ease of parking..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-2.5 font-bold text-white shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
