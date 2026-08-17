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

type TabType = "search" | "bookings" | "vehicles" | "points" | "profile";

export function DashboardClient({ profile }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("search");

  return (
    <div className="space-y-6">
      {/* Navigation Tab Bar in White Theme */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm no-scrollbar">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "search"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>🔍</span>
          <span>Find Parking</span>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "bookings"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>🎫</span>
          <span>My Bookings & Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab("vehicles")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "vehicles"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>🚗</span>
          <span>My Vehicles</span>
        </button>

        <button
          onClick={() => setActiveTab("points")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "points"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>💎</span>
          <span>VIP Loyalty & Points</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>👤</span>
          <span>My Profile</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="transition-all">
        {activeTab === "search" && <GarageSearch />}
        {activeTab === "bookings" && <BookingsList />}
        {activeTab === "vehicles" && <VehiclesManager />}
        {activeTab === "points" && <PointsLedger />}
        {activeTab === "profile" && <ProfileEditor initialProfile={profile} />}
      </div>
    </div>
  );
}
