"use client";

import { useEffect, useState } from "react";

import { PaymentModal } from "./payment-modal";
import { RatingModal } from "./rating-modal";

interface Booking {
  id: number;
  garage_id: string;
  parking_name: string;
  parking_address: string;
  license_plate: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  price_per_hour: number;
  total_amount: number;
  paid_with_points: boolean;
  points_used: number;
  has_rating?: boolean;
}

interface BookingsListProps {
  onRefreshStats?: () => void;
}

export function BookingsList({ onRefreshStats }: BookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);

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

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking? If already paid, a refund will be processed.")) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel booking");
      }
      alert("Booking cancelled successfully.");
      fetchBookings();
      if (onRefreshStats) onRefreshStats();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error cancelling booking");
    }
  };

  const duePayments = bookings.filter((b) => b.payment_status === "pending" && b.status !== "cancelled");

  return (
    <div className="space-y-8">
      {/* Header matching payment_history.php lines 432-437 */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Payment History & Bookings</h2>
        <p className="text-white/80 text-xs">View your parking reservations, complete payments, and generate invoices</p>
      </div>

      {/* Payment Summary KPI Cards matching payment_history.php lines 440-460 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f39c12]/20 border border-[#f39c12] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💳</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Total Bookings</h3>
            <p className="text-[#f39c12] text-xl font-bold mt-0.5">{bookings.length}</p>
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">⏳</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pending Due Payments</h3>
            <p className="text-amber-400 text-xl font-bold mt-0.5">{duePayments.length}</p>
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/15 p-6 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">✓</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Completed & Settled</h3>
            <p className="text-emerald-400 text-xl font-bold mt-0.5">
              {bookings.filter((b) => b.payment_status === "paid").length}
            </p>
          </div>
        </div>
      </div>

      {/* Due / Pending Bookings Section */}
      {duePayments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Action Required: Due Payments ({duePayments.length})</h3>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-black/50 backdrop-blur-md border border-amber-500/30 shadow-xl">
            <table className="w-full text-left text-xs text-white/90">
              <thead className="border-b border-white/10 bg-white/5 uppercase text-[10px] text-white/60 tracking-wider">
                <tr>
                  <th className="p-4">Garage & Location</th>
                  <th className="p-4">Booking Date & Time</th>
                  <th className="p-4">Plate / Duration</th>
                  <th className="p-4">Amount Due</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {duePayments.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition">
                    <td className="p-4">
                      <div className="font-bold text-white">{b.parking_name}</div>
                      <div className="text-[11px] text-white/60 truncate max-w-xs">{b.parking_address}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{b.booking_date}</div>
                      <div className="text-white/60">{b.booking_time}</div>
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[11px] font-bold text-white border border-white/10">
                        {b.license_plate}
                      </span>
                      <div className="text-white/60 mt-1">{b.duration} hour(s)</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-[#f39c12]">৳{b.total_amount.toFixed(2)}</div>
                      <span className="inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        Pending Payment
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBookingForPayment(b)}
                        className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] px-4 py-2 text-xs font-bold text-white shadow transition"
                      >
                        Pay Now 💳
                      </button>
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 px-3 py-2 text-xs font-medium text-white transition border border-white/10"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Complete Booking History Table matching payment_history.php */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">All Bookings & Payment Records</h3>

        {loading ? (
          <div className="h-64 rounded-2xl bg-black/40 border border-white/10 animate-pulse" />
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 p-12 text-center shadow-xl">
            <span className="text-4xl">🎫</span>
            <h4 className="text-base font-bold text-white mt-3">No Reservations Found</h4>
            <p className="text-xs text-white/70 mt-1">
              You have not booked any parking spaces yet. Explore available locations to reserve.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 shadow-xl">
            <table className="w-full text-left text-xs text-white/90">
              <thead className="border-b border-white/10 bg-white/5 uppercase text-[10px] text-white/60 tracking-wider">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Garage Space</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Receipt / Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {bookings.map((b) => {
                  const isPaid = b.payment_status === "paid";
                  const isCancelled = b.status === "cancelled";

                  return (
                    <tr key={b.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono font-bold text-white/80">#BK-{b.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{b.parking_name}</div>
                        <div className="text-[11px] text-white/60 truncate max-w-xs">{b.parking_address}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{b.booking_date}</div>
                        <div className="text-white/60">{b.booking_time} ({b.duration}h)</div>
                      </td>
                      <td className="p-4">
                        <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[11px] font-bold text-white border border-white/10">
                          {b.license_plate}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">৳{b.total_amount.toFixed(2)}</div>
                        <div className="text-[10px] text-white/60">
                          {b.paid_with_points ? `Redeemed ${b.points_used} PTS` : "Digital Payment"}
                        </div>
                      </td>
                      <td className="p-4">
                        {isCancelled ? (
                          <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                            Cancelled
                          </span>
                        ) : isPaid ? (
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            Paid ✓
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {isPaid && (
                          <button
                            onClick={() => setSelectedInvoiceBooking(b)}
                            className="rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 px-3 py-1.5 text-xs font-semibold text-white transition"
                          >
                            🧾 Invoice
                          </button>
                        )}
                        {b.status === "completed" && !b.has_rating && (
                          <button
                            onClick={() => setSelectedBookingForRating(b)}
                            className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] px-3 py-1.5 text-xs font-bold text-white transition shadow"
                          >
                            ★ Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Gateway Modal */}
      {selectedBookingForPayment && (
        <PaymentModal
          bookingId={selectedBookingForPayment.id}
          garageName={selectedBookingForPayment.parking_name}
          amount={selectedBookingForPayment.total_amount}
          pointsUsed={selectedBookingForPayment.points_used}
          onClose={() => setSelectedBookingForPayment(null)}
          onPaymentSuccess={() => {
            setSelectedBookingForPayment(null);
            fetchBookings();
            if (onRefreshStats) onRefreshStats();
          }}
        />
      )}

      {/* Rating & Review Modal */}
      {selectedBookingForRating && (
        <RatingModal
          bookingId={selectedBookingForRating.id}
          garageId={selectedBookingForRating.garage_id}
          garageName={selectedBookingForRating.parking_name}
          onClose={() => setSelectedBookingForRating(null)}
          onRatingSuccess={() => {
            setSelectedBookingForRating(null);
            fetchBookings();
          }}
        />
      )}

      {/* Printable Invoice Modal matching payment_history.php */}
      {selectedInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-neutral-900 rounded-3xl border border-white/20 p-8 shadow-2xl space-y-6 text-white text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#f39c12] flex items-center justify-center font-bold text-black text-sm">
                  P
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Parking Lagbe Receipt</h3>
                  <p className="text-white/60 text-[10px]">Official Booking Receipt</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceBooking(null)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-black/50 rounded-2xl p-5 border border-white/10">
              <div className="flex justify-between">
                <span className="text-white/60">Booking ID:</span>
                <span className="font-mono font-bold text-white">#BK-{selectedInvoiceBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Parking Space:</span>
                <span className="font-bold text-white text-right">{selectedInvoiceBooking.parking_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Date & Arrival:</span>
                <span className="text-white">
                  {selectedInvoiceBooking.booking_date} at {selectedInvoiceBooking.booking_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">License Plate:</span>
                <span className="font-mono font-bold text-white">{selectedInvoiceBooking.license_plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Duration:</span>
                <span className="text-white">{selectedInvoiceBooking.duration} hour(s)</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                <span className="font-bold text-white">Total Paid:</span>
                <span className="font-bold text-[#f39c12]">৳{selectedInvoiceBooking.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-2.5 font-bold text-white transition shadow"
              >
                🖨️ Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoiceBooking(null)}
                className="flex-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 py-2.5 font-semibold text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
