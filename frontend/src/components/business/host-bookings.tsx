"use client";

import { useEffect, useState } from "react";

interface HostBookingItem {
  id: number;
  garage_id: string;
  parking_space_name: string;
  customer_username: string;
  license_plate: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  total_amount: number;
  owner_earnings: number;
}

export function HostBookings() {
  const [bookings, setBookings] = useState<HostBookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/business/bookings");
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
        const res = await fetch("/api/business/bookings");
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

  const handleUpdateStatus = async (
    bookingId: number,
    newStatus: "active" | "completed"
  ) => {
    try {
      const res = await fetch("/api/business/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update booking status");
      }

      fetchBookings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating status");
    }
  };

  const activeCount = bookings.filter((b) => b.status === "active").length;
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Driver Check-In & Live Bookings</h2>
          <p className="text-xs text-slate-500">
            Verify arriving drivers, check in vehicles, and manage reservations at your gates.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 font-bold">
            {activeCount} Parked Inside
          </span>
          <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 font-bold">
            {upcomingCount} Arriving Soon
          </span>
        </div>
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="text-4xl mb-3">🎫</div>
          <h3 className="text-base font-bold text-slate-900">No driver bookings recorded</h3>
          <p className="mt-1 text-xs text-slate-500">
            Active and upcoming reservations for your facilities will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="border-b border-slate-200 bg-slate-50 uppercase text-[10px] text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Ref / Vehicle</th>
                <th className="p-4">Facility Space</th>
                <th className="p-4">Driver Account</th>
                <th className="p-4">Arrival & Duration</th>
                <th className="p-4">Host Net (70%)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-900">#BK-{b.id}</div>
                    <span className="inline-block mt-0.5 rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 border border-slate-200">
                      {b.license_plate}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-slate-900">{b.parking_space_name}</td>

                  <td className="p-4 text-slate-600">@{b.customer_username}</td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{b.booking_date}</div>
                    <div className="text-slate-500">{b.booking_time} ({b.duration}h)</div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-emerald-600">৳{b.owner_earnings.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-400">Total: ৳{b.total_amount.toFixed(2)}</div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        b.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : b.status === "upcoming"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : b.status === "completed"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    {b.status === "upcoming" && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "active")}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition"
                      >
                        🚗 Check In
                      </button>
                    )}
                    {b.status === "active" && (
                      <button
                        onClick={() => handleUpdateStatus(b.id, "completed")}
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition"
                      >
                        🏁 Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
