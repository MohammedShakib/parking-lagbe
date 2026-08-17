"use client";

import { useState } from "react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";

import { GaragePortfolio, HostGarage } from "./garage-portfolio";
import { HostBookings } from "./host-bookings";
import { HostReviews } from "./host-reviews";
import { IncomeAnalytics } from "./income-analytics";
import { ScheduleControls } from "./schedule-controls";

interface BusinessClientProps {
  profile: ProfileWithAccount | null;
}

type HostTab = "portfolio" | "schedules" | "bookings" | "income" | "reviews";

export function BusinessClient({ profile }: BusinessClientProps) {
  const [activeTab, setActiveTab] = useState<HostTab>("portfolio");
  const [selectedGarageForSchedule, setSelectedGarageForSchedule] = useState<HostGarage | null>(null);

  const handleSelectGarage = (garage: HostGarage) => {
    setSelectedGarageForSchedule(garage);
    setActiveTab("schedules");
  };

  return (
    <div className="space-y-6">
      {/* Space Host Header Banner in White Theme */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 mb-2">
            <span>🏢</span>
            <span>Space Host Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome, {profile?.first_name || profile?.username}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your listed parking facilities, live capacities, 24/7 schedules, driver check-in, and net revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Host Net Share</span>
            <div className="text-lg font-black text-emerald-600">70.0% Payout</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation in White Theme */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm no-scrollbar">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "portfolio"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>🏢</span>
          <span>My Parking Spaces</span>
        </button>

        <button
          onClick={() => setActiveTab("schedules")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "schedules"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>⏱️</span>
          <span>Schedules & Status Override</span>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "bookings"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>🚗</span>
          <span>Driver Check-In & Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab("income")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "income"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>💰</span>
          <span>Revenue & Income Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "reviews"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>⭐</span>
          <span>Customer Reviews & Ratings</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "portfolio" && (
          <GaragePortfolio onSelectGarageForSchedule={handleSelectGarage} />
        )}
        {activeTab === "schedules" && (
          <ScheduleControls selectedGarage={selectedGarageForSchedule} />
        )}
        {activeTab === "bookings" && <HostBookings />}
        {activeTab === "income" && <IncomeAnalytics />}
        {activeTab === "reviews" && <HostReviews />}
      </div>
    </div>
  );
}
