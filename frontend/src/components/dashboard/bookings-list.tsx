"use client";

import { useEffect, useState } from "react";

import { PaymentModal } from "./payment-modal";
import { RatingModal } from "./rating-modal";

export interface BookingItem {
  id: number;
  username: string;
  garage_id: string;
  license_plate: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  paid_with_points: boolean;
  points_used: number;
  garage_name: string;
  garage_address: string;
  price_per_hour: number;
  total_amount: number;
  payment?: {
    payment_id: number;
    transaction_id: string;
    amount: number;
    payment_method: string;
    payment_status: string;
    payment_date: string;
  };
  rating?: {
    rating: number;
    review_text: string | null;
  };
}

interface BookingsListProps {
  onRefreshStats?: () => void;
}

export function BookingsList({ onRefreshStats }: BookingsListProps) {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modals state
  const [selectedForPayment, setSelectedForPayment] = useState<BookingItem | null>(null);
  const [selectedForRating, setSelectedForRating] = useState<BookingItem | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<BookingItem | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (!ignore && data.bookings) {
          setBookings(data.bookings);
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

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchBookings();
        if (onRefreshStats) onRefreshStats();
      } else {
        alert(data.error || "Failed to cancel booking");
      }
    } catch {
      alert("Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return b.status === "upcoming" || b.status === "active";
    return b.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "upcoming":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "completed":
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-700";
    }
  };

  return (
    <div>
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">My Reservations & Bookings</h2>
          <p className="text-xs text-neutral-400">
            Track active parking spots, make payments, and view past reservation receipts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 p-1">
          {["all", "active", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filterStatus === st
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {st === "active" ? "Active / Upcoming" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
          <div className="text-4xl mb-3">🎫</div>
          <h3 className="text-base font-bold text-white">No reservations found</h3>
          <p className="mt-1 text-xs text-neutral-400">
            You don&apos;t have any {filterStatus !== "all" ? filterStatus : ""} bookings at the moment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((b) => {
            const isPendingPayment = b.payment_status === "pending" && b.status !== "cancelled";
            const isUpcoming = b.status === "upcoming";
            const isCompleted = b.status === "completed";

            return (
              <div
                key={b.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-xl transition hover:border-neutral-700 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">
                      #{b.id}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${getStatusBadge(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                    {b.payment_status === "paid" ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                        Paid ✓
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                        Payment Pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{b.garage_name}</h3>
                  <p className="text-xs text-neutral-400">📍 {b.garage_address}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 pt-1">
                    <div>
                      <span className="text-neutral-500">Date:</span> <strong>{b.booking_date}</strong> at{" "}
                      <strong>{b.booking_time}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500">Duration:</span>{" "}
                      <strong>{b.duration} hrs</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500">Vehicle:</span>{" "}
                      <strong className="font-mono">{b.license_plate}</strong>
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full md:w-auto border-t md:border-t-0 border-neutral-800 pt-3 md:pt-0">
                  <div className="text-left md:text-right mr-3">
                    <div className="text-[10px] uppercase text-neutral-500">Total Bill</div>
                    <div className="text-lg font-black text-white">৳{b.total_amount}</div>
                  </div>

                  {isPendingPayment && (
                    <button
                      onClick={() => setSelectedForPayment(b)}
                      className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/20 hover:opacity-95"
                    >
                      Pay Now ৳{b.total_amount}
                    </button>
                  )}

                  {b.payment_status === "paid" && (
                    <button
                      onClick={() => setSelectedReceipt(b)}
                      className="w-full sm:w-auto rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700"
                    >
                      Receipt 📄
                    </button>
                  )}

                  {isUpcoming && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="w-full sm:w-auto rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20"
                    >
                      Cancel
                    </button>
                  )}

                  {isCompleted && !b.rating && (
                    <button
                      onClick={() => setSelectedForRating(b)}
                      className="w-full sm:w-auto rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
                    >
                      Rate Spot ⭐
                    </button>
                  )}

                  {b.rating && (
                    <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                      <span>★ {b.rating.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      {selectedForPayment && (
        <PaymentModal
          bookingId={selectedForPayment.id}
          garageName={selectedForPayment.garage_name}
          amount={selectedForPayment.total_amount}
          pointsUsed={selectedForPayment.points_used}
          onClose={() => setSelectedForPayment(null)}
          onPaymentSuccess={() => {
            setSelectedForPayment(null);
            fetchBookings();
            if (onRefreshStats) onRefreshStats();
          }}
        />
      )}

      {/* Rating Modal */}
      {selectedForRating && (
        <RatingModal
          bookingId={selectedForRating.id}
          garageId={selectedForRating.garage_id}
          garageName={selectedForRating.garage_name}
          onClose={() => setSelectedForRating(null)}
          onRatingSuccess={() => {
            setSelectedForRating(null);
            fetchBookings();
          }}
        />
      )}

      {/* View Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              ✕
            </button>

            <div className="border-b border-neutral-800 pb-4 mb-4">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Official Receipt
              </span>
              <h3 className="text-xl font-bold text-white mt-2">Parking Lagbe Invoice</h3>
              <p className="text-xs text-neutral-400">Booking #{selectedReceipt.id}</p>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-300 mb-6">
              <div className="flex justify-between">
                <span className="text-neutral-500">Parking Space:</span>
                <span className="font-semibold text-white">{selectedReceipt.garage_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Vehicle:</span>
                <span className="font-mono text-white">{selectedReceipt.license_plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date & Duration:</span>
                <span>{selectedReceipt.booking_date} ({selectedReceipt.duration} hrs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID:</span>
                <span className="font-mono text-emerald-400">
                  {selectedReceipt.payment?.transaction_id || "TXN_CONFIRMED"}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-800 pt-2 font-bold text-sm text-white">
                <span>Amount Paid:</span>
                <span className="text-emerald-400">৳{selectedReceipt.total_amount}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full rounded-xl bg-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700"
            >
              Print / Save PDF 🖨️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
