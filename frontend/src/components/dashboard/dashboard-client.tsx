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
    { id: "search", label: "Find Parking Spaces", icon: "🗺️" },
    { id: "bookings", label: "My Bookings", icon: "🎫" },
    { id: "vehicles", label: "My Vehicles", icon: "🚗" },
    { id: "points", label: "Loyalty Points", icon: "⭐" },
    { id: "profile", label: "My Profile", icon: "👤" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f39c12]/40 bg-[#f39c12]/20 px-3.5 py-1 text-xs font-bold text-[#f39c12]">
            <span>●</span> Driver Hub & Spot Discovery
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl drop-shadow-md">
            Welcome, {profile?.first_name || profile?.username || "Driver"}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
            Find and reserve verified parking spaces across Dhaka, manage your personal vehicles, make quick digital payments, and redeem reward points.
          </p>
        </div>

        {/* Quick Stats matching home.php */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div
            onClick={() => setActiveTab("points")}
            className="cursor-pointer rounded-xl bg-black/40 border border-white/15 p-3.5 transition hover:border-[#f39c12]/60 hover:bg-black/60"
          >
            <div className="text-[10px] uppercase tracking-wider text-white/60">Points Balance</div>
            <div className="text-xl font-bold text-[#f39c12] mt-0.5">{points.toLocaleString()} PTS</div>
          </div>
          <div
            onClick={() => setActiveTab("points")}
            className="cursor-pointer rounded-xl bg-black/40 border border-white/15 p-3.5 transition hover:border-white/30 hover:bg-black/60"
          >
            <div className="text-[10px] uppercase tracking-wider text-white/60">VIP Tier</div>
            <div className="text-xl font-bold text-white capitalize mt-0.5">{profile?.user_level || "Bronze"}</div>
          </div>
          <div
            onClick={() => setActiveTab("vehicles")}
            className="cursor-pointer rounded-xl bg-black/40 border border-white/15 p-3.5 transition hover:border-white/30 hover:bg-black/60"
          >
            <div className="text-[10px] uppercase tracking-wider text-white/60">Registered Cars</div>
            <div className="text-xs font-bold text-[#f39c12] mt-2">+ Add Vehicle</div>
          </div>
          <div
            onClick={() => setActiveTab("bookings")}
            className="cursor-pointer rounded-xl bg-black/40 border border-white/15 p-3.5 transition hover:border-white/30 hover:bg-black/60"
          >
            <div className="text-[10px] uppercase tracking-wider text-white/60">Active Bookings</div>
            <div className="text-xs font-bold text-[#f39c12] mt-2">View Activity →</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs matching PHP colors */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-white/20 pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as typeof activeTab)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === item.id
                ? "bg-[#f39c12] text-white shadow-lg shadow-[#f39c12]/30"
                : "border border-white/15 bg-black/40 text-white/80 hover:border-white/30 hover:text-white"
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
