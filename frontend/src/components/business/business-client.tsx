"use client";

import { useState } from "react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";
import { GaragePortfolio } from "./garage-portfolio";
import { HostBookings } from "./host-bookings";
import { HostReviews } from "./host-reviews";
import { IncomeAnalytics } from "./income-analytics";
import { ScheduleControls } from "./schedule-controls";

interface BusinessClientProps {
  profile: ProfileWithAccount | null;
}

export function BusinessClient({ profile }: BusinessClientProps) {
  const [activeTab, setActiveTab] = useState<"portfolio" | "schedule" | "bookings" | "income" | "reviews">("portfolio");

  const navItems = [
    { id: "portfolio", label: "My Garage Portfolio", icon: "🏢" },
    { id: "schedule", label: "Operating Schedule & Status", icon: "⚡" },
    { id: "bookings", label: "Customer Bookings", icon: "🎫" },
    { id: "income", label: "Monthly Income (70%)", icon: "💰" },
    { id: "reviews", label: "Driver Ratings & Reviews", icon: "⭐" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner matching business_desh.php */}
      <div className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f39c12]/40 bg-[#f39c12]/20 px-3.5 py-1 text-xs font-bold text-[#f39c12]">
            <span>●</span> Host Operations & Parking Management
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl drop-shadow-md">
            Space Host Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
            Logged in as <span className="text-white font-bold">@{profile?.username}</span> ({profile?.first_name} {profile?.last_name}). Manage your parking spaces, configure operating schedules, check in arriving drivers, and track your 70% net revenue.
          </p>
        </div>

        {/* Top Indicators */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-2.5">
            <div className="text-[10px] uppercase text-white/60">Owner ID</div>
            <div className="text-xs font-bold text-white font-mono">{profile?.owner_id || `G_owner_${profile?.username}`}</div>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-2.5">
            <div className="text-[10px] uppercase text-white/60">Host Verification</div>
            <div className="text-xs font-bold text-amber-400">
              {profile?.is_verified_owner ? "Verified Host ✓" : "Registered Host"}
            </div>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-2.5">
            <div className="text-[10px] uppercase text-white/60">Profit Split</div>
            <div className="text-xs font-bold text-[#f39c12]">70% Net Payout / 30% Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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
        {activeTab === "portfolio" && (
          <GaragePortfolio
            onSelectGarageForSchedule={() => {
              setActiveTab("schedule");
            }}
          />
        )}

        {activeTab === "schedule" && <ScheduleControls />}

        {activeTab === "bookings" && <HostBookings />}

        {activeTab === "income" && <IncomeAnalytics />}

        {activeTab === "reviews" && <HostReviews />}
      </div>
    </div>
  );
}
