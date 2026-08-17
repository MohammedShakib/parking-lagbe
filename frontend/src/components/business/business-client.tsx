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
    { id: "portfolio", label: "Garage Portfolio", icon: "🏢" },
    { id: "schedule", label: "Schedule & Overrides", icon: "⚡" },
    { id: "bookings", label: "Customer Check-Ins", icon: "🎫" },
    { id: "income", label: "Earnings (70%)", icon: "💰" },
    { id: "reviews", label: "Driver Reviews", icon: "⭐" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-teal-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
            <span>●</span> Host Operations Portal
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Space Host Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Logged in as <span className="text-white font-medium">@{profile?.username}</span> ({profile?.first_name} {profile?.last_name}). Control your parking portfolio, configure schedules, check in arriving drivers, and track your 70% net revenue.
          </p>
        </div>

        {/* Top Indicators */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 px-4 py-2.5">
            <div className="text-[10px] uppercase text-neutral-500">Owner ID</div>
            <div className="text-xs font-bold text-white font-mono">{profile?.owner_id || `G_owner_${profile?.username}`}</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 px-4 py-2.5">
            <div className="text-[10px] uppercase text-neutral-500">Host Verification</div>
            <div className="text-xs font-bold text-amber-400">
              {profile?.is_verified_owner ? "Verified ✓" : "Registered Host"}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 px-4 py-2.5">
            <div className="text-[10px] uppercase text-neutral-500">Revenue Split</div>
            <div className="text-xs font-bold text-teal-400">70% Net Payout / 30% Platform</div>
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
                ? "bg-teal-400 text-neutral-950 shadow-lg shadow-teal-500/20"
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
