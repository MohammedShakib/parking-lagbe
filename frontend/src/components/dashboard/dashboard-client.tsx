"use client";

import { useState } from "react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";
import { BookingsList } from "./bookings-list";
import { GarageSearch } from "./garage-search";
import { PointsLedger } from "./points-ledger";
import { ProfileEditor } from "./profile-editor";
import { VehiclesManager } from "./vehicles-manager";

interface DashboardClientProps {
  profile: ProfileWithAccount | null;
}

export function DashboardClient({ profile }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"search" | "bookings" | "vehicles" | "points" | "profile">("search");
  const [points, setPoints] = useState(profile?.points || 0);

  const handleBookingSuccess = () => {
    setActiveTab("bookings");
  };

  const navItems = [
    { id: "search", label: "Find Parking", icon: "🗺️" },
    { id: "bookings", label: "My Bookings", icon: "🎫" },
    { id: "vehicles", label: "My Vehicles", icon: "🚗" },
    { id: "points", label: "Loyalty Points", icon: "⭐" },
    { id: "profile", label: "Profile & Settings", icon: "⚙️" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span>●</span> Driver Hub & Navigation
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Welcome, {profile?.first_name || profile?.username || "Driver"}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Find and reserve verified parking spaces across Dhaka, manage your vehicles, make quick payments, and redeem reward points.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            onClick={() => setActiveTab("points")}
            className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 transition hover:border-amber-500/40"
          >
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Points Balance</div>
            <div className="text-lg font-black text-amber-400 mt-0.5">{points.toLocaleString()} pts</div>
          </div>
          <div
            onClick={() => setActiveTab("points")}
            className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 transition hover:border-neutral-700"
          >
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Tier Status</div>
            <div className="text-lg font-black text-white capitalize mt-0.5">{profile?.user_level || "Bronze"}</div>
          </div>
          <div
            onClick={() => setActiveTab("vehicles")}
            className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 transition hover:border-neutral-700"
          >
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Quick Action</div>
            <div className="text-xs font-bold text-emerald-400 mt-1.5">+ Add Vehicle</div>
          </div>
          <div
            onClick={() => setActiveTab("bookings")}
            className="cursor-pointer rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 transition hover:border-neutral-700"
          >
            <div className="text-[10px] uppercase tracking-wider text-neutral-500">Active Bookings</div>
            <div className="text-xs font-bold text-emerald-400 mt-1.5">View Activity →</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-neutral-800 pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as typeof activeTab)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === item.id
                ? "bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/20"
                : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === "search" && (
          <GarageSearch
            userPoints={points}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsList
            onRefreshStats={() => {
              // Refresh points
              fetch("/api/points")
                .then((r) => r.json())
                .then((d) => {
                  if (d.points !== undefined) setPoints(d.points);
                })
                .catch(() => {});
            }}
          />
        )}

        {activeTab === "vehicles" && <VehiclesManager />}

        {activeTab === "points" && <PointsLedger />}

        {activeTab === "profile" && <ProfileEditor initialProfile={profile} />}
      </div>
    </div>
  );
}
