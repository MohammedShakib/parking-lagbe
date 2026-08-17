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
      {/* Header in White Theme */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Payment History & Bookings</h2>
        <p className="text-slate-500 text-xs">View your parking reservations, complete payments, and generate invoices</p>
      </div>

      {/* Payment Summary KPI Cards in White Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 border border-[#f39c12] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💳</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Total Bookings</h3>
            <p className="text-[#d97706] text-xl font-bold mt-0.5">{bookings.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 border border-amber-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">⏳</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Pending Due Payments</h3>
            <p className="text-amber-600 text-xl font-bold mt-0.5">{duePayments.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">✓</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Completed & Settled</h3>
            <p className="text-emerald-600 text-xl font-bold mt-0.5">
              {bookings.filter((b) => b.payment_status === "paid").length}
            </p>
          </div>
        </div>
      </div>

      {/* Due / Pending Bookings Section */}
      {duePayments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900">Action Required: Due Payments ({duePayments.length})</h3>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white border border-amber-200 shadow-sm">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="border-b border-slate-200 bg-amber-50/50 uppercase text-[10px] text-slate-600 tracking-wider">
                <tr>
                  <th className="p-4">Garage & Location</th>
                  <th className="p-4">Booking Date & Time</th>
                  <th className="p-4">Plate / Duration</th>
                  <th className="p-4">Amount Due</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {duePayments.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{b.parking_name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{b.parking_address}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{b.booking_date}</div>
                      <div className="text-slate-500">{b.booking_time}</div>
                    </td>
                    <td className="p-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 border border-slate-200">
                        {b.license_plate}
                      </span>
                      <div className="text-slate-500 mt-1">{b.duration} hour(s)</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-[#d97706]">৳{b.total_amount.toFixed(2)}</div>
                      <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        Pending Payment
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBookingForPayment(b)}
                        className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] px-4 py-2 text-xs font-bold text-white shadow-sm transition"
                      >
                        Pay Now 💳
                      </button>
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 px-3 py-2 text-xs font-medium text-slate-700 transition border border-slate-200"
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

      {/* Complete Booking History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">All Bookings & Payment Records</h3>

        {loading ? (
          <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse" />
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center shadow-sm">
            <span className="text-4xl">🎫</span>
            <h4 className="text-base font-bold text-slate-900 mt-3">No Reservations Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              You have not booked any parking spaces yet. Explore available locations to reserve.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="border-b border-slate-200 bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
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
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => {
                  const isPaid = b.payment_status === "paid";
                  const isCancelled = b.status === "cancelled";

                  return (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-mono font-bold text-slate-700">#BK-{b.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{b.parking_name}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{b.parking_address}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{b.booking_date}</div>
                        <div className="text-slate-500">{b.booking_time} ({b.duration}h)</div>
                      </td>
                      <td className="p-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 border border-slate-200">
                          {b.license_plate}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900">৳{b.total_amount.toFixed(2)}</div>
                        <div className="text-[10px] text-slate-500">
                          {b.paid_with_points ? `Redeemed ${b.points_used} PTS` : "Digital Payment"}
                        </div>
                      </td>
                      <td className="p-4">
                        {isCancelled ? (
                          <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                            Cancelled
                          </span>
                        ) : isPaid ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            Paid ✓
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {isPaid && (
                          <button
                            onClick={() => setSelectedInvoiceBooking(b)}
                            className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition shadow-sm"
                          >
                            🧾 Invoice
                          </button>
                        )}
                        {b.status === "completed" && !b.has_rating && (
                          <button
                            onClick={() => setSelectedBookingForRating(b)}
                            className="rounded-xl bg-[#f39c12] hover:bg-[#e67e22] px-3 py-1.5 text-xs font-bold text-white transition shadow-sm"
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

      {/* Printable Invoice Modal in White Theme */}
      {selectedInvoiceBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl space-y-6 text-slate-800 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#f39c12] flex items-center justify-center font-black text-white text-sm">
                  P
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Parking Lagbe Receipt</h3>
                  <p className="text-slate-500 text-[10px]">Official Booking Receipt</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID:</span>
                <span className="font-mono font-bold text-slate-900">#BK-{selectedInvoiceBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parking Space:</span>
                <span className="font-bold text-slate-900 text-right">{selectedInvoiceBooking.parking_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Arrival:</span>
                <span className="text-slate-800">
                  {selectedInvoiceBooking.booking_date} at {selectedInvoiceBooking.booking_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">License Plate:</span>
                <span className="font-mono font-bold text-slate-900">{selectedInvoiceBooking.license_plate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="text-slate-800">{selectedInvoiceBooking.duration} hour(s)</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-sm">
                <span className="font-bold text-slate-900">Total Paid:</span>
                <span className="font-black text-[#d97706]">৳{selectedInvoiceBooking.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-3 font-bold text-white transition shadow-md shadow-[#f39c12]/20"
              >
                🖨️ Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoiceBooking(null)}
                className="flex-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 py-3 font-semibold text-slate-700 transition"
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
