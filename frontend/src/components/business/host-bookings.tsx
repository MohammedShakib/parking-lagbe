"use client";

import { useEffect, useState } from "react";

interface HostBookingItem {
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
  garage_name: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
}

export function HostBookings() {
  const [bookings, setBookings] = useState<HostBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchHostBookings = async () => {
    try {
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

  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch("/api/business/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, newStatus }),
      });
      if (res.ok) {
        fetchHostBookings();
      }
    } catch {
      // Handled
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Customer Reservations & Check-Ins</h2>
          <p className="text-xs text-neutral-400">
            Monitor incoming drivers, confirm check-in arrivals, and manage parking duration.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-950 p-1">
          {["all", "upcoming", "active", "completed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                filter === st
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-xs text-neutral-500">
          No customer bookings found for this filter.
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-xl transition hover:border-neutral-700 shadow-xl"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">#{b.id}</span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                      b.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : b.status === "upcoming"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-neutral-800 text-neutral-300 border-neutral-700"
                    }`}
                  >
                    {b.status === "active" ? "● Parked / In-Garage" : b.status}
                  </span>
                  <span className="text-xs text-neutral-400">• {b.garage_name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                  <div>
                    <span className="text-neutral-500">Driver:</span>{" "}
                    <strong className="text-white">{b.customer_name}</strong> ({b.customer_phone})
                  </div>
                  <div>
                    <span className="text-neutral-500">License Plate:</span>{" "}
                    <strong className="font-mono text-teal-300 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/30">
                      {b.license_plate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500">Time:</span>{" "}
                    <strong>{b.booking_date}</strong> at <strong>{b.booking_time}</strong> ({b.duration} hrs)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 border-neutral-800 pt-3 md:pt-0">
                <div className="text-left md:text-right mr-3">
                  <div className="text-[10px] uppercase text-neutral-500">Bill</div>
                  <div className="text-base font-bold text-white">৳{b.total_amount}</div>
                </div>

                {b.status === "upcoming" && (
                  <button
                    disabled={updatingId === b.id}
                    onClick={() => handleUpdateStatus(b.id, "active")}
                    className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-400 transition"
                  >
                    {updatingId === b.id ? "..." : "Check-in Driver 🚗"}
                  </button>
                )}

                {b.status === "active" && (
                  <button
                    disabled={updatingId === b.id}
                    onClick={() => handleUpdateStatus(b.id, "completed")}
                    className="rounded-xl bg-teal-400 px-3.5 py-2 text-xs font-bold text-neutral-950 hover:bg-teal-300 transition"
                  >
                    {updatingId === b.id ? "..." : "Mark Completed ✓"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
